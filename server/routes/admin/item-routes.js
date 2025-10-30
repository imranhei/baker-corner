import express from "express";
import {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} from "../../controller/admin/item-controller.js";
import { checkAuth } from "../../controller/auth/auth-controller.js";

const router = express.Router();

router.post("/", checkAuth, createItem);
router.get("/", checkAuth, getItems);
router.put("/:id", checkAuth, updateItem);
router.delete("/:id", checkAuth, deleteItem);

export default router;
