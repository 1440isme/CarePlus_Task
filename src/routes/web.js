import express from "express";
import homeController from "../controllers/homeController";
import authController from "../controllers/authController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", (req, res) => {
        return res.redirect("/home");
    });
    router.get('/home', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.getFindAllCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // Auth routes (Forgot Password)
    router.get('/forgot-password', authController.getForgotPasswordPage);
    router.post('/forgot-password', authController.postForgotPassword);
    router.get('/reset-password', authController.getResetPasswordPage);
    router.post('/reset-password', authController.postResetPassword);


    // User Profile Routes
    router.get('/profile', homeController.getProfile);
    router.post('/profile', homeController.postProfile);

    return app.use("/", router);
}
module.exports = initWebRoutes;