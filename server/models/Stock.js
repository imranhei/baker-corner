import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      unique: true,
    },
    totalQuantity: { type: Number, default: 0 },
    avgPurchasePrice: { type: Number, default: 0 },
    avgSalePrice: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
