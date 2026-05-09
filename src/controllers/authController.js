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
    getForgotPasswordPage: getForgotPasswordPage,
    postForgotPassword: postForgotPassword,
    getResetPasswordPage: getResetPasswordPage,
    postResetPassword: postResetPassword,
};
