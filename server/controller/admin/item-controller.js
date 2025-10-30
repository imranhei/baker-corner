import Item from "../../models/Item.js";
import Category from "../../models/Category.js";

// Create item
export const createItem = async (req, res) => {
  try {
    const { name, category } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    const item = new Item({ name, category });
    await item.save();

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all items (with category, pagination, filter)
export const getItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;

    const items = await Item.find(query)
      .populate("category", "name")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      data: items,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, message: "Invalid category" });
      }
    }

    const item = await Item.findByIdAndUpdate(id, req.body, { new: true }).populate("category", "name");
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    res.json({ success: true, message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
