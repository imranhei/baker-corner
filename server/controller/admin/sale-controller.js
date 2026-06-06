import Sale from "../../models/Sale.js";
import Item from "../../models/Item.js";
import { recalcStockForItem } from "../../utils/stockUtils.js";

/**
 * Create sale
 */
export async function createSale(req, res) {
  try {
    const { itemId, quantity, price, date } = req.body;

    let item = await Item.findById(itemId);
    if (!item)
      return res
        .status(400)
        .json({ success: false, message: "Item not found" });

    const sale = await Sale.create({ item: itemId, quantity, price, date }); // without populate item

    await recalcStockForItem(itemId);

    return res.status(201).json({ success: true, sale });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Update sale
 */
export async function updateSale(req, res) {
  try {
    const { id } = req.params;
    const { quantity, price, date, itemId } = req.body;

    const sale = await Sale.findById(id);
    if (!sale)
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });

    const oldItemId = sale.item.toString();

    if (itemId && itemId !== oldItemId) {
      const itemExists = await Item.findById(itemId);
      if (!itemExists)
        return res
          .status(400)
          .json({ success: false, message: "New item not found" });
      sale.item = itemId;
    }

    if (quantity !== undefined) sale.quantity = quantity;
    if (price !== undefined) sale.price = price;
    if (date !== undefined) sale.date = date;

    await sale.save();

    await recalcStockForItem(oldItemId);
    if (itemId && itemId !== oldItemId) await recalcStockForItem(itemId);

    return res.json({ success: true, sale });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Delete sale
 */
export async function deleteSale(req, res) {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    const itemId = sale.item;

    // delete the sale properly
    await Sale.findByIdAndDelete(id); // or: await sale.deleteOne();

    // recalc stock after delete
    await recalcStockForItem(itemId);

    return res.json({ success: true, message: "Sale deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * List sales with pagination/filtering/sorting
 * Same query params as purchases: page, limit, item, q, dateFrom, dateTo, minPrice, maxPrice, sort
 */
export async function listSales(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      item,
      q,
      dateFrom,
      dateTo,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(200, Math.max(1, parseInt(limit, 20) || 20));
    const skip = (numericPage - 1) * numericLimit;

    // ---------- Filters ----------
    const filter = {};
    if (item) filter.item = new mongoose.Types.ObjectId(item);
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

    // ---------- Main Pipeline ----------
    const aggregatePipeline = [
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
      { $unwind: { path: "$item.category", preserveNullAndEmptyArrays: true } },
    ];

    // search by item name
    if (q) {
      aggregatePipeline.push({
        $match: { "item.name": { $regex: q, $options: "i" } },
      });
    }

    // sorting
    let sortObj = { date: -1 };
    if (sort) {
      const [field, dir] = sort.split(":");
      sortObj = { [field]: dir === "asc" ? 1 : -1 };
    }
    aggregatePipeline.push({ $sort: sortObj });

    // pagination
    aggregatePipeline.push({ $skip: skip });
    aggregatePipeline.push({ $limit: numericLimit });

    // only keep required fields
    aggregatePipeline.push({
      $project: {
        _id: 1,
        quantity: 1,
        price: 1,
        date: 1,
        "item._id": 1,
        "item.name": 1,
        "item.category._id": 1,
        "item.category.name": 1,
      },
    });

    const sales = await Sale.aggregate(aggregatePipeline);

    // ---------- Count Pipeline (without pagination) ----------
    const countPipeline = [
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
    ];

    if (q) {
      countPipeline.push({
        $match: { "item.name": { $regex: q, $options: "i" } },
      });
    }

    countPipeline.push({ $count: "total" });
    const countRes = await Sale.aggregate(countPipeline);
    const total = countRes[0]?.total || 0;

    // ---------- Response ----------
    return res.json({
      success: true,
      data: sales,
      meta: {
        page: numericPage,
        limit: numericLimit,
        total,
        pages: Math.ceil(total / numericLimit),
        hasMore: numericPage < Math.ceil(total / numericLimit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
