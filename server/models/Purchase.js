import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {  // per unit cost price
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // supplier: {
    //   type: String, // optional: supplier name
    //   trim: true,
    // },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
