import express from "express";
import {
  register,
  login,
  checkAuth,
  resetPassword,
} from "../../controller/auth/auth-controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", checkAuth, (req, res) => {
  const user = req.user;
  const role = req.role;
  res
    .status(200)
    .json({ success: true, message: "User authenticated", user, role });
});
router.post("/reset-password", checkAuth, resetPassword);

export default router;