import express from "express";
const router = express.Router();

import {
    listStocks,
    getStockByItem,
    recalcStock,
} from "../../controller/admin/stock-controller.js";
import { checkAuth } from "../../controller/auth/auth-controller.js";

router.get("/", checkAuth, listStocks);
router.get("/item/:itemId", checkAuth, getStockByItem);
router.post("/recalc/:itemId", checkAuth, recalcStock);

export default router;