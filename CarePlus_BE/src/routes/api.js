import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import userApiController from "../controllers/userApiController";
import publicCatalogController from "../controllers/publicCatalogController";
import adminCatalogController from "../controllers/adminCatalogController";
import appointmentController from "../controllers/appointmentController";
import relativeProfileController from "../controllers/relativeProfileController";

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
router.get("/api/profile/engagement", authMiddleware.verifyToken, userApiController.getMyEngagement);
router.post("/api/profile/favorite-doctors/:doctorId/toggle", authMiddleware.verifyToken, userApiController.toggleFavoriteDoctor);
router.post("/api/profile/doctor-reviews", authMiddleware.verifyToken, userApiController.submitDoctorReview);
router.post("/api/profile/recent-views/doctors/:slugOrId", authMiddleware.verifyToken, userApiController.trackDoctorView);
router.get("/api/appointments/my", authMiddleware.verifyToken, appointmentController.getMyAppointments);
router.post("/api/appointments", authMiddleware.verifyToken, appointmentController.createAppointment);
router.patch("/api/appointments/:id/cancel", authMiddleware.verifyToken, appointmentController.cancelAppointment);
router.get("/api/relatives/my", authMiddleware.verifyToken, relativeProfileController.listMyRelatives);
router.post("/api/relatives", authMiddleware.verifyToken, relativeProfileController.createRelative);
router.put("/api/relatives/:id", authMiddleware.verifyToken, relativeProfileController.updateRelative);
router.delete("/api/relatives/:id", authMiddleware.verifyToken, relativeProfileController.deleteRelative);

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
router.get("/api/admin/users", adminCatalogController.getUsers);
router.post("/api/admin/users", adminCatalogController.createUser);
router.put("/api/admin/users/:id", adminCatalogController.updateUser);
router.delete("/api/admin/users/:id", adminCatalogController.deleteUser);
router.post("/api/admin/users/:id/toggle-lock", adminCatalogController.toggleUserAccountLock);
router.post("/api/admin/users/:id/toggle-booking-lock", adminCatalogController.toggleUserBookingLock);
router.post("/api/admin/users/:id/reset-no-show", adminCatalogController.resetUserNoShow);

module.exports = router;
