import mongoose from "mongoose";
import Purchase from "../models/Purchase.js";
import Sale from "../models/Sale.js";
import Stock from "../models/Stock.js";

/**
 * Recalculate stock summary for a single item and persist to Stock collection.
 * Weighted average purchase price = sum(price*qty)/sum(qty) for purchases >0
 * avgSalePrice similar for sales.
 */
export async function recalcStockForItem(itemId) {
  const objectId = new mongoose.Types.ObjectId(itemId);

  // Aggregate purchases
  const purchaseAgg = await Purchase.aggregate([
    { $match: { item: objectId } },
    {
      $group: {
        _id: "$item",
        totalPurchasedQty: { $sum: "$quantity" },
        totalPurchaseCost: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
  ]);

  // Aggregate sales
  const saleAgg = await Sale.aggregate([
    { $match: { item: objectId } },
    {
      $group: {
        _id: "$item",
        totalSoldQty: { $sum: "$quantity" },
        totalSalesValue: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
  ]);

  const totalPurchasedQty = purchaseAgg[0]?.totalPurchasedQty || 0;
  const totalPurchaseCost = purchaseAgg[0]?.totalPurchaseCost || 0;

  const totalSoldQty = saleAgg[0]?.totalSoldQty || 0;
  const totalSalesValue = saleAgg[0]?.totalSalesValue || 0;

  const totalQuantity = totalPurchasedQty - totalSoldQty;

  const avgPurchasePrice =
    totalPurchasedQty > 0 ? totalPurchaseCost / totalPurchasedQty : 0;
  const avgSalePrice = totalSoldQty > 0 ? totalSalesValue / totalSoldQty : 0;

  return await Stock.findOneAndUpdate(
    { item: objectId },
    {
      item: objectId,
      totalQuantity,
      avgPurchasePrice,
      avgSalePrice,
      lastUpdated: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

/**
 * Optionally, recalc for all items (not used on every request; heavy).
 */
export async function recalcAllStocks() {
  // find all item ids present in purchases or sales
  const purchaseItems = await Purchase.distinct("item");
  const saleItems = await Sale.distinct("item");
  const items = Array.from(new Set([...purchaseItems, ...saleItems]));

  const results = [];
  for (const itemId of items) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await recalcStockForItem(itemId));
  }
  return results;
}
