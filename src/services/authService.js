import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import db from "../models/index";
import jwtUtils from "../utils/jwt";

const MAX_FAILED_ATTEMPTS = 5;
const TEMP_LOCK_MINUTES = 15;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeUser = (user) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        isLocked: user.isLocked,
        lastLoginAt: user.lastLoginAt,
    };
};

const buildRedirectUrlByRole = (role) => {
    return role === "admin" ? "/get-crud" : "/user/profile";
};

const buildLoginError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const resetFailedAttempts = async (user) => {
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.lastLoginAt = new Date();
    await user.save();
};

const registerFailedAttempt = async (user) => {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + TEMP_LOCK_MINUTES * 60 * 1000);
    }

    await user.save();
};

const findUserByLogin = async (login) => {
    return db.User.findOne({
        where: {
            [Op.or]: [
                { email: login },
                { username: login },
            ],
        },
    });
};

let loginUser = async ({ login, password }) => {
    const normalizedLogin = (login || "").trim();
    const normalizedPassword = password || "";

    if (!normalizedLogin || !normalizedPassword) {
        throw buildLoginError("Username/email và mật khẩu không được để trống", 400);
    }

    if (normalizedLogin.includes("@") && !EMAIL_REGEX.test(normalizedLogin)) {
        throw buildLoginError("Email đăng nhập không đúng định dạng", 400);
    }

    const user = await findUserByLogin(normalizedLogin);
    if (!user) {
        throw buildLoginError("Sai tài khoản hoặc mật khẩu", 401);
    }

    if (!user.isActive || user.isLocked) {
        throw buildLoginError("Tài khoản đã bị khóa hoặc vô hiệu hóa", 403);
    }

    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
        throw buildLoginError("Tài khoản đang tạm khóa. Vui lòng thử lại sau.", 423);
    }

    const isPasswordValid = bcrypt.compareSync(normalizedPassword, user.password);
    if (!isPasswordValid) {
        await registerFailedAttempt(user);
        throw buildLoginError("Sai tài khoản hoặc mật khẩu", 401);
    }

    await resetFailedAttempts(user);

    const token = jwtUtils.signAccessToken({
        id: user.id,
        role: user.role,
        username: user.username,
    });

    return {
        success: true,
        message: "Đăng nhập thành công",
        token,
        role: user.role,
        redirectUrl: buildRedirectUrlByRole(user.role),
        user: sanitizeUser(user),
    };
};

let getCurrentUser = async (userId) => {
    const user = await db.User.findOne({
        where: { id: userId },
    });

    if (!user) {
        throw buildLoginError("Không tìm thấy người dùng", 404);
    }

    return sanitizeUser(user);
};

module.exports = {
    loginUser,
    getCurrentUser,
    buildRedirectUrlByRole,
};
