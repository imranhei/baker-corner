import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../controller/admin/category-controller.js";
import { checkAuth } from "../../controller/auth/auth-controller.js";

const router = express.Router();

router.post("/", checkAuth, createCategory);
router.get("/", checkAuth, getCategories);
router.put("/:id", checkAuth, updateCategory);
router.delete("/:id", checkAuth, deleteCategory);

export default router;
