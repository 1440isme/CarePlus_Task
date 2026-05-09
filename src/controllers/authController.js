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

module.exports = {
    getRegisterPage,
    handleRegister
};