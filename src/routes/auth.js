import express from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";
import rateLimitMiddleware from "../middlewares/rateLimitMiddleware";

let router = express.Router();

router.post("/auth/login", rateLimitMiddleware.loginRateLimiter, authController.login);
router.get("/auth/me", authMiddleware.verifyToken, authController.getCurrentSession);

module.exports = router;
