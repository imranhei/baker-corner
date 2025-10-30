import Stock from "../../models/Stock.js";
import Item from "../../models/Item.js";
import { recalcStockForItem } from "../../utils/stockUtils.js";

/**
 * Get paginated stock list with filtering and sorting
 * Query params: page, limit, q (item name), minQty, maxQty, sort
 */
export async function listStocks(req, res) {
  try {
    const { page = 1, limit = 20, q, minQty, maxQty, sort } = req.query;
    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(200, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (numericPage - 1) * numericLimit;

    const match = {};
    if (minQty || maxQty) {
      match.totalQuantity = {};
      if (minQty) match.totalQuantity.$gte = Number(minQty);
      if (maxQty) match.totalQuantity.$lte = Number(maxQty);
    }

    const pipeline = [
      { $match: match },
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

    if (q) {
      pipeline.push({ $match: { "item.name": { $regex: q, $options: "i" } } });
    }

    // Sorting
    let sortObj = { lastUpdated: -1 };
    if (sort) {
      const [field, dir] = sort.split(":");
      sortObj = { [field]: dir === "asc" ? 1 : -1 };
    }

    pipeline.push({ $sort: sortObj });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: numericLimit });

    // ✅ Project only necessary fields
    pipeline.push({
      $project: {
        _id: 1,
        totalQuantity: 1,
        avgPurchasePrice: 1,
        avgSalePrice: 1,
        lastUpdated: 1,
        "item._id": 1,
        "item.name": 1,
        "item.category._id": 1,
        "item.category.name": 1,
      },
    });

    const stocks = await Stock.aggregate(pipeline);

    // Count total
    const countPipeline = pipeline.slice(0, -4); // remove sort, skip, limit, project
    countPipeline.push({ $count: "total" });
    const countRes = await Stock.aggregate(countPipeline);
    const total = countRes[0]?.total || 0;

    return res.json({
      success: true,
      data: stocks,
      meta: {
        page: numericPage,
        limit: numericLimit,
        total,
        pages: Math.ceil(total / numericLimit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Get single stock by itemId
 */
export async function getStockByItem(req, res) {
  try {
    const { itemId } = req.params;
    const stock = await Stock.findOne({ item: itemId }).populate("item");
    if (!stock) return res.status(404).json({ success: false, message: "Stock not found" });
    return res.json({ success: true, data: stock });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Force recalc for an item (admin endpoint)
 */
export async function recalcStock(req, res) {
  try {
    const { itemId } = req.params;
    const updated = await recalcStockForItem(itemId);
    return res.json({ success: true, stock: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
