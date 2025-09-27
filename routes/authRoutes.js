// routes/authRoutes.js
import { Router } from "express";
import passport from "../config/passport.js"; // <-- import này rất quan trọng!
import { googleSignInController } from "../controllers/authController.js";

const router = Router();

// Bắt đầu flow Google OAuth
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback từ Google → xác thực
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/login/failed" }),
    // Nếu thành công thì gọi controller render homepage, set session...
    (req, res) => new googleSignInController().signInSuccess(req, res)
);

// Trang success / failed (nếu bạn có dùng)
router.get("/login/success", (req, res) => {
    return new googleSignInController().signInSuccess(req, res);
});
router.get("/login/failed", (req, res) => {
    return new googleSignInController().signInFailed(req, res);
});

export default router;
