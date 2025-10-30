import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    },
    // company: {
    //   type: String,
    //   trim: true,
    // },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
