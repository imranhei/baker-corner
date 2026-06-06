import Purchase from "../../models/Purchase.js";
import Item from "../../models/Item.js";
import { recalcStockForItem } from "../../utils/stockUtils.js";

/**
 * Create purchase
 */
export async function createPurchase(req, res) {
  try {
    const { itemId, quantity, price, date } = req.body;

    // validate item with category
    const item = await Item.findById(itemId).populate("category", "name");
    if (!item)
      return res
        .status(400)
        .json({ success: false, message: "Item not found" });

    const purchase = await Purchase.create({
      item: itemId,
      quantity,
      price,
      date,
    });

    await recalcStockForItem(itemId);

    return res.status(201).json({ success: true, purchase, item });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Update purchase
 */
export async function updatePurchase(req, res) {
  try {
    const { id } = req.params;
    const { quantity, price, date, itemId } = req.body;

    const purchase = await Purchase.findById(id);
    if (!purchase)
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });

    const oldItemId = purchase.item.toString();

    // If itemId changed, validate and update
    if (itemId && itemId !== oldItemId) {
      const itemExists = await Item.findById(itemId);
      if (!itemExists)
        return res
          .status(400)
          .json({ success: false, message: "New item not found" });
      purchase.item = itemId;
    }

    if (quantity !== undefined) purchase.quantity = quantity;
    if (price !== undefined) purchase.price = price;
    if (date !== undefined) purchase.date = date;

    await purchase.save();

    // recalc stock for old + new items
    await recalcStockForItem(oldItemId);
    if (itemId && itemId !== oldItemId) await recalcStockForItem(itemId);

    const populatedPurchase = await Purchase.findById(purchase._id).populate({
      path: "item",
      select: "name category",
      populate: { path: "category", select: "name" },
    });

    return res.json({ success: true, purchase: populatedPurchase });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Delete purchase
 */
export async function deletePurchase(req, res) {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    const itemId = purchase.item;

    // delete the document
    await purchase.deleteOne();

    // recalc stock
    await recalcStockForItem(itemId);

    return res.json({ success: true, message: "Purchase deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * List purchases with pagination, filtering, sorting
 * Query params:
 *  page (default 1), limit (default 20),
 *  item (itemId), q (search item name),
 *  dateFrom, dateTo,
 *  minPrice, maxPrice,
 *  sort (ex: date:desc or price:asc)
 */
export async function listPurchases(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      item,
      category,
      q,
      dateFrom,
      dateTo,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(200, Math.max(1, parseInt(limit, 10) || 20));

    const skip = (numericPage - 1) * numericLimit;

    const filter = {};

    if (item) filter.item = item;

    if (dateFrom || dateTo) {
      filter.date = {};

      if (dateFrom) filter.date.$gte = new Date(dateFrom);

      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);

      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let aggregatePipeline = [
      { $match: filter },

      {
        $lookup: {
          from: "items",
          localField: "item",
          foreignField: "_id",
          as: "item",
        },
      },

      { $unwind: "$item" },

      {
        $lookup: {
          from: "categories",
          localField: "item.category",
          foreignField: "_id",
          as: "item.category",
        },
      },

      { $unwind: "$item.category" },
    ];

    if (q) {
      aggregatePipeline.push({
        $match: {
          "item.name": {
            $regex: q,
            $options: "i",
          },
        },
      });
    }

    if (category) {
      aggregatePipeline.push({
        $match: {
          "item.category._id": new mongoose.Types.ObjectId(category),
        },
      });
    }

    let sortObj = { date: -1 };

    if (sort) {
      const [field, dir] = sort.split(":");

      sortObj = {
        [field]: dir === "asc" ? 1 : -1,
      };
    }

    aggregatePipeline.push({ $sort: sortObj });
    aggregatePipeline.push({ $skip: skip });
    aggregatePipeline.push({ $limit: numericLimit });

    const purchases = await Purchase.aggregate(aggregatePipeline);

    const countPipeline = aggregatePipeline.slice(0, -3);

    countPipeline.push({ $count: "total" });

    const countRes = await Purchase.aggregate(countPipeline);

    const total = countRes[0]?.total || 0;

    const hasMore = purchases.length === numericLimit;

    return res.json({
      success: true,
      data: purchases,

      pagination: {
        total,
        page: numericPage,
        limit: numericLimit,
        hasMore,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
