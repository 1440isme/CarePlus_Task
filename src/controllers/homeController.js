import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let users = await CRUDService.getAllUsers();
        return res.render("homepage.ejs", { users });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi máy chủ");
    }
};

let getAboutPage = async (req, res) => {
    return res.render("about.ejs");
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let getFindAllCRUD = async (req, res) => {
    try {
        return res.render("displayCRUD.ejs");
    } catch (e) {
        console.log(e);
        return res.status(500).send("Lỗi máy chủ");
    }
};

let getEditCRUD = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) return res.redirect("/get-crud");

        return res.render("editCRUD.ejs", { userId: id });
    } catch (e) {
        console.log(e);
        return res.status(500).send("Lỗi máy chủ");
    }
};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    getFindAllCRUD: getFindAllCRUD,
    getEditCRUD: getEditCRUD,
};
    try {
        let id = req.query.id;
        if (!id) return res.redirect("/get-crud");

        let user = await CRUDService.getUserInfoById(id);
        if (!user) return res.redirect("/get-crud");

        return res.render("editCRUD.ejs", { user });
    } catch (e) {
        console.log(e);
        return res.status(500).send("Lỗi máy chủ");
    }
};

let putCRUD = async (req, res) => {
    try {
        await CRUDService.updateUserData(req.body);
        return res.redirect("/get-crud");
    } catch (e) {
        console.log(e);
        return res.status(500).send("Lỗi máy chủ");
    }
};

let deleteCRUD = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) await CRUDService.deleteUserById(id);
        return res.redirect("/get-crud");
    } catch (e) {
        console.log(e);
        return res.status(500).send("Lỗi máy chủ");
    }
};

let getProfile = async (req, res) => {
    try {
        // Tạm thời lấy id từ query (ví dụ: /profile?id=1) để giả lập user đã login
        let id = req.query.id; 
        if (!id) return res.send("Vui lòng đăng nhập (truyền ?id=...)");

        let user = await CRUDService.getUserInfoById(id);
        if (!user) return res.send("Không tìm thấy người dùng");

        let status = req.query.status;
        return res.render("profile.ejs", { user, status });
    } catch (e) {
        console.log(e);
        return res.status(500).send("Lỗi máy chủ");
    }
};

let postProfile = async (req, res) => {
    try {
        // User chỉ được sửa thông tin cá nhân, không được sửa quyền (role)
        delete req.body.role; 
        
        await CRUDService.updateUserData(req.body);
        return res.redirect(`/profile?id=${req.body.id}&status=success`);
    } catch (e) {
        console.log(e);
        return res.status(500).send("Lỗi máy chủ");
    }
};



module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    getFindAllCRUD: getFindAllCRUD,
    postCRUD: postCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
    getProfile: getProfile,
    postProfile: postProfile,
};
