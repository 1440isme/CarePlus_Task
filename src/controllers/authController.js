import authService from "../services/authService";
import CRUDService from "../services/CRUDService";

let getRegisterPage = async (req, res) => {
  return res.render("auth/register.ejs");
};

let handleRegister = async (req, res) => {
  try {
    await CRUDService.createNewUser(req.body);
    return res.redirect("/home");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Lỗi máy chủ");
  }
};

let getLoginPage = (req, res) => {
  return res.render("login.ejs");
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

module.exports = {
  getLoginPage,
  login,
  getCurrentSession,
  getRegisterPage,
  handleRegister,
};
