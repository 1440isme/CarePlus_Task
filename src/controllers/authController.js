import authService from "../services/authService";

let getLoginPage = (req, res) => {
    return res.render("login.ejs");
};

let getRegisterPage = (req, res) => {
    return res.render("register.ejs");
};

let login = async (req, res) => {
    try {
        const result = await authService.loginUser({
            login: req.body.login,
            password: req.body.password,
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Đăng nhập thất bại",
        });
    }
};

let getCurrentSession = async (req, res) => {
    try {
        const user = await authService.getCurrentUser(req.user.id);
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Không thể lấy thông tin phiên đăng nhập",
        });
    }
};

// Gửi mã xác thực qua email
let sendVerificationCode = async (req, res) => {
    try {
        const { email, username } = req.body;
        const result = await authService.sendVerificationCode(email, username);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Không gửi được mã xác thực",
        });
    }
};

// Đăng ký tài khoản
let register = async (req, res) => {
    try {
        const { username, email, password, verificationCode } = req.body;
        const result = await authService.registerUser({ username, email, password, verificationCode });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Đăng ký thất bại",
        });
const CRUDService = require("../services/CRUDService");
const { sendOTPEmail } = require("../utils/emailSender");

// Forgot password flow
let getForgotPasswordPage = (req, res) => {
    return res.render('forgotPassword.ejs');
};

let postForgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(">>> Request forgot password for email:", email);
    try {
        const user = await CRUDService.getUserInfoByEmail(email);
        if (!user) {
            console.log(">>> User not found");
            return res.render('forgotPassword.ejs', { error: 'Email không tồn tại' });
        }
        
        console.log(">>> Generating OTP...");
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        await CRUDService.updateUserOTP(email, otp, expires);
        console.log(">>> OTP saved to DB:", otp);

        console.log(">>> Sending email...");
        try {
            await sendOTPEmail(email, otp);
            console.log(">>> Email sent successfully");
            return res.render('resetPassword.ejs', { email });
        } catch (mailError) {
            console.error(">>> Error sending email:", mailError);
            return res.render('forgotPassword.ejs', { 
                error: 'Không thể gửi email lúc này. Vui lòng kiểm tra lại cấu hình SMTP trong file .env' 
            });
        }
    } catch (e) {
        console.error(">>> Global Error in postForgotPassword:", e);
        return res.status(500).send('Lỗi máy chủ');
    }
};

let getResetPasswordPage = (req, res) => {
    // This page is rendered after OTP is sent; no extra logic needed.
    return res.render('resetPassword.ejs');
};

let postResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await CRUDService.getUserInfoByEmail(email);
        if (!user) return res.render('resetPassword.ejs', { error: 'Email không tồn tại', email: email });
        
        if (user.otpCode !== otp || new Date(user.otpExpiresAt) < new Date()) {
            return res.render('resetPassword.ejs', { 
                error: 'OTP không hợp lệ hoặc đã hết hạn',
                email: email // Pass email back so it doesn't disappear from the form
            });
        }
        // Update password and mark verified
        await CRUDService.updateUserPasswordAndVerify(email, newPassword);
        return res.redirect('/login'); // assume login route exists
    } catch (e) {
        console.log(e);
        return res.status(500).send('Lỗi máy chủ');
    }
};

module.exports = {
    getLoginPage,
    getRegisterPage,
    login,
    getCurrentSession,
    sendVerificationCode,
    register,
    getForgotPasswordPage: getForgotPasswordPage,
    postForgotPassword: postForgotPassword,
    getResetPasswordPage: getResetPasswordPage,
    postResetPassword: postResetPassword,
};
