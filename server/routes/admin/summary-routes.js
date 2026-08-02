import express from "express";
import { checkAuth } from "../../controller/auth/auth-controller.js";
import { getSummary } from "../../controller/admin/summary-controller.js";

const router = express.Router();

router.get("/", checkAuth, getSummary);

export default router;