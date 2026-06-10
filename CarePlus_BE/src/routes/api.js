import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userApiController from "../controllers/userApiController";
import publicCatalogController from "../controllers/publicCatalogController";
import adminCatalogController from "../controllers/adminCatalogController";

let router = express.Router();

router.get("/api/public/home", publicCatalogController.getHomeData);
router.get("/api/public/specialties", publicCatalogController.getSpecialties);
router.get("/api/public/specialties/:slugOrId", publicCatalogController.getSpecialtyDetail);
router.get("/api/public/doctors", publicCatalogController.getDoctors);
router.get("/api/public/doctors/:slugOrId", publicCatalogController.getDoctorDetail);
router.get("/api/public/doctors/:slugOrId/available-slots", publicCatalogController.getDoctorAvailableSlots);
router.get("/api/public/articles", publicCatalogController.getArticles);
router.get("/api/public/articles/:slugOrId", publicCatalogController.getArticleDetail);

router.get("/api/profile/me", authMiddleware.verifyToken, userApiController.getMyProfile);
router.put("/api/profile/me", authMiddleware.verifyToken, userApiController.updateMyProfile);

router.use("/api/users", authMiddleware.verifyToken, authMiddleware.requireRole("admin"));
router.get("/api/users", userApiController.getAllUsers);
router.get("/api/users/:id", userApiController.getUserById);
router.post("/api/users", userApiController.createUser);
router.put("/api/users/:id", userApiController.updateUser);
router.delete("/api/users/:id", userApiController.deleteUser);

router.use("/api/admin", authMiddleware.verifyToken, authMiddleware.requireRole("admin"));
router.get("/api/admin/dashboard", adminCatalogController.getDashboard);
router.get("/api/admin/specialties", adminCatalogController.getSpecialties);
router.post("/api/admin/specialties", adminCatalogController.createSpecialty);
router.put("/api/admin/specialties/:id", adminCatalogController.updateSpecialty);
router.delete("/api/admin/specialties/:id", adminCatalogController.deleteSpecialty);
router.get("/api/admin/doctors", adminCatalogController.getDoctors);
router.post("/api/admin/doctors", adminCatalogController.createDoctor);
router.put("/api/admin/doctors/:id", adminCatalogController.updateDoctor);
router.delete("/api/admin/doctors/:id", adminCatalogController.deleteDoctor);

module.exports = router;
