import express from "express";
const router = express.Router();

import {
  createPurchase,
  deletePurchase,
  listPurchases,
  updatePurchase,
} from "../../controller/admin/purchase-controller.js";
import { checkAuth } from "../../controller/auth/auth-controller.js";

router.post("/", checkAuth, createPurchase);
router.get("/", checkAuth, listPurchases);
router.put("/:id", checkAuth, updatePurchase);
router.delete("/:id", checkAuth, deletePurchase);

export default router;
