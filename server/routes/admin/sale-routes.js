import express from "express";
const router = express.Router();

import {
  createSale,
  listSales,
  updateSale,
  deleteSale,
} from "../../controller/admin/sale-controller.js";
import { checkAuth } from "../../controller/auth/auth-controller.js";

router.post("/", checkAuth, createSale);
router.get("/", checkAuth, listSales);
router.put("/:id", checkAuth, updateSale);
router.delete("/:id", checkAuth, deleteSale);

export default router;
