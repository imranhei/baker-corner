import express from "express";
import { checkAuth } from "../../controller/auth/auth-controller.js";
import {
  getSummary,
  getRecentSales,
} from "../../controller/admin/summary-controller.js";

const router = express.Router();

router.get("/", checkAuth, getSummary);
router.get("/recent-sales", checkAuth, getRecentSales);

export default router;
