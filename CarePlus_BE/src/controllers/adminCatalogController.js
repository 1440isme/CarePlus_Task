import publicCatalogService from "../services/publicCatalogService";
import CRUDService from "../services/CRUDService";

const handleError = (res, error, fallbackMessage) => {
    return res.status(error.status || 500).json({
        success: false,
        message: error.message || fallbackMessage,
    });
};

const getDashboard = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: await publicCatalogService.getAdminDashboardData(),
        });
    } catch (error) {
        return handleError(res, error, "Không thể tải dữ liệu tổng quan quản trị");
    }
};

const getSpecialties = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            ...(await publicCatalogService.listAdminSpecialties(req.query)),
        });
    } catch (error) {
        return handleError(res, error, "Không thể tải danh sách chuyên khoa quản trị");
    }
};

const createSpecialty = async (req, res) => {
    try {
        return res.status(201).json({
            success: true,
            item: await publicCatalogService.createSpecialty(req.body),
            message: "Tạo chuyên khoa thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể tạo chuyên khoa");
    }
};

const updateSpecialty = async (req, res) => {
    try {
        const item = await publicCatalogService.updateSpecialty(req.params.id, req.body);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy chuyên khoa",
            });
        }

        return res.status(200).json({
            success: true,
            item,
            message: "Cập nhật chuyên khoa thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể cập nhật chuyên khoa");
    }
};

const deleteSpecialty = async (req, res) => {
    try {
        const deleted = await publicCatalogService.deleteSpecialty(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy chuyên khoa",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa chuyên khoa thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể xóa chuyên khoa");
    }
};

const getDoctors = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            ...(await publicCatalogService.listAdminDoctors(req.query)),
        });
    } catch (error) {
        return handleError(res, error, "Không thể tải danh sách bác sĩ quản trị");
    }
};

const createDoctor = async (req, res) => {
    try {
        return res.status(201).json({
            success: true,
            item: await publicCatalogService.createDoctor(req.body),
            message: "Tạo bác sĩ thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể tạo bác sĩ");
    }
};

const updateDoctor = async (req, res) => {
    try {
        const item = await publicCatalogService.updateDoctor(req.params.id, req.body);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bác sĩ",
            });
        }

        return res.status(200).json({
            success: true,
            item,
            message: "Cập nhật bác sĩ thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể cập nhật bác sĩ");
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const deleted = await publicCatalogService.deleteDoctor(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bác sĩ",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa bác sĩ thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể xóa bác sĩ");
    }
};

const getUsers = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            ...(await CRUDService.getAdminUsers(req.query)),
        });
    } catch (error) {
        return handleError(res, error, "Không thể tải danh sách người dùng quản trị");
    }
};

const createUser = async (req, res) => {
    try {
        await CRUDService.createNewUser(req.body);
        return res.status(201).json({
            success: true,
            message: "Tạo người dùng thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể tạo người dùng");
    }
};

const updateUser = async (req, res) => {
    try {
        await CRUDService.updateUserData({
            ...req.body,
            id: req.params.id,
        });
        return res.status(200).json({
            success: true,
            message: "Cập nhật người dùng thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể cập nhật người dùng");
    }
};

const deleteUser = async (req, res) => {
    try {
        await CRUDService.deleteUserById(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Xóa người dùng thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể xóa người dùng");
    }
};

const toggleUserAccountLock = async (req, res) => {
    try {
        const item = await CRUDService.toggleUserAccountLock(
            req.params.id,
            typeof req.body?.locked === "boolean" ? req.body.locked : undefined,
        );
        return res.status(200).json({
            success: true,
            item,
            message: item.isLocked ? "Đã khóa tài khoản người dùng" : "Đã mở khóa tài khoản người dùng",
        });
    } catch (error) {
        return handleError(res, error, "Không thể cập nhật trạng thái khóa tài khoản");
    }
};

const toggleUserBookingLock = async (req, res) => {
    try {
        const item = await CRUDService.toggleUserBookingLock(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            item,
            message: item.patientProfile?.bookingLocked ? "Đã khóa quyền đặt lịch" : "Đã mở khóa quyền đặt lịch",
        });
    } catch (error) {
        return handleError(res, error, "Không thể cập nhật trạng thái khóa đặt lịch");
    }
};

const resetUserNoShow = async (req, res) => {
    try {
        const item = await CRUDService.resetUserNoShow(req.params.id);
        return res.status(200).json({
            success: true,
            item,
            message: "Đã reset số lần no-show",
        });
    } catch (error) {
        return handleError(res, error, "Không thể reset no-show");
    }
};

module.exports = {
    getDashboard,
    getSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserAccountLock,
    toggleUserBookingLock,
    resetUserNoShow,
};
