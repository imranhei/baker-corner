import Category from "../../models/Category.js";

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all categories (with pagination + filter)
export const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const categories = await Category.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Category.countDocuments(query);
    // Total categories overall (ignoring search)
    const totalAll = await Category.countDocuments({});

    res.json({
      success: true,
      data: categories,
      pagination: { total, totalAll, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted", data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
