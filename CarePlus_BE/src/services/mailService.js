require("dotenv").config();
const nodemailer = require("nodemailer");

const normalizePassword = (value) => {
  if (!value) {
    return "";
  }

  // Gmail app passwords are often copied with spaces every 4 characters.
  return String(value).replace(/\s+/g, "");
};

const buildTransportConfig = ({
  host,
  port,
  secure,
  user,
  pass,
  from,
  label,
}) => {
  if (!host || !port || !user || !pass) {
    return null;
  }

  return {
    label,
    from: from || user,
    transporter: nodemailer.createTransport({
      host,
      port: Number(port),
      secure: String(secure) === "true",
      pool: true,
      maxConnections: 1,
      maxMessages: 20,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      auth: {
        user,
        pass: normalizePassword(pass),
      },
    }),
  };
};

const transportCandidates = [
  buildTransportConfig({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
    label: "primary",
  }),
  buildTransportConfig({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT_2 || process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE_2 ?? "false",
    user: process.env.SMTP_USER_2,
    pass: process.env.SMTP_PASS_2,
    from: process.env.SMTP_FROM_2 || process.env.SMTP_USER_2,
    label: "secondary",
  }),
].filter(Boolean);

if (!transportCandidates.length) {
  console.warn("[MAIL] Không tìm thấy cấu hình SMTP hợp lệ trong biến môi trường.");
}

const sendWithTransport = async (transportConfig, mailOptions) => {
  await transportConfig.transporter.sendMail({
    ...mailOptions,
    from: transportConfig.from,
  });
  console.log(`[MAIL] Đã gửi email qua ${transportConfig.label} tới: ${mailOptions.to}`);
};

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    to,
    subject,
    text,
  };

  let lastError = null;

  for (const transportConfig of transportCandidates) {
    try {
      await sendWithTransport(transportConfig, mailOptions);
      return true;
    } catch (err) {
      lastError = err;
      console.error(`[MAIL] Gửi email thất bại qua ${transportConfig.label}:`, {
        message: err.message,
        code: err.code,
        command: err.command,
        response: err.response,
        responseCode: err.responseCode,
        to,
      });
    }
  }

  const error = new Error("Không gửi được email. Vui lòng thử lại sau.");
  error.statusCode = 503;
  error.cause = lastError;
  throw error;
};

const sendVerificationEmail = async (to, otpCode, expireMinutes) => {
  const subject = "Xác thực tài khoản CarePlus của bạn";
  const text = `Xin chào,\n\nCảm ơn bạn đã đăng ký tài khoản tại CarePlus.\nĐể hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác thực (OTP) dưới đây:\n\nMã xác thực của bạn: ${otpCode}\nMã này sẽ hết hạn sau ${expireMinutes} phút.\n\nVui lòng không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn cho tài khoản của bạn.\nNếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.\n\nTrân trọng,\nĐội ngũ CarePlus\n\nEmail này được gửi tự động, vui lòng không trả lời lại.`;
  return sendEmail(to, subject, text);
};

const sendForgotPasswordEmail = async (to, otpCode, expireMinutes) => {
  const subject = "Khôi phục mật khẩu CarePlus của bạn";
  const text = `Xin chào,\n\nBạn đã yêu cầu khôi phục mật khẩu tại CarePlus.\nĐể hoàn tất quá trình này, vui lòng sử dụng mã xác thực (OTP) dưới đây:\n\nMã xác thực của bạn: ${otpCode}\nMã này sẽ hết hạn sau ${expireMinutes} phút.\n\nVui lòng không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn cho tài khoản của bạn.\nNếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.\n\nTrân trọng,\nĐội ngũ CarePlus\n\nEmail này được gửi tự động, vui lòng không trả lời lại.`;
  return sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendForgotPasswordEmail,
};
