let getUserProfilePage = (req, res) => {
    return res.render("userProfile.ejs");
};

let getAdminProfilePage = (req, res) => {
    return res.render("adminProfile.ejs");
};

module.exports = {
    getAdminProfilePage,
    getUserProfilePage,
};
