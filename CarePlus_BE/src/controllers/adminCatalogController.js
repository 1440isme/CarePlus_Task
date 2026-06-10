import publicCatalogService from "../services/publicCatalogService";

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
            data: publicCatalogService.getAdminDashboardData(),
        });
    } catch (error) {
        return handleError(res, error, "Không thể tải dữ liệu tổng quan quản trị");
    }
};

const getSpecialties = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            ...publicCatalogService.listAdminSpecialties(req.query),
        });
    } catch (error) {
        return handleError(res, error, "Không thể tải danh sách chuyên khoa quản trị");
    }
};

const createSpecialty = async (req, res) => {
    try {
        return res.status(201).json({
            success: true,
            item: publicCatalogService.createSpecialty(req.body),
            message: "Tạo chuyên khoa thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể tạo chuyên khoa");
    }
};

const updateSpecialty = async (req, res) => {
    try {
        const item = publicCatalogService.updateSpecialty(req.params.id, req.body);
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
        const deleted = publicCatalogService.deleteSpecialty(req.params.id);
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
            ...publicCatalogService.listAdminDoctors(req.query),
        });
    } catch (error) {
        return handleError(res, error, "Không thể tải danh sách bác sĩ quản trị");
    }
};

const createDoctor = async (req, res) => {
    try {
        return res.status(201).json({
            success: true,
            item: publicCatalogService.createDoctor(req.body),
            message: "Tạo bác sĩ thành công",
        });
    } catch (error) {
        return handleError(res, error, "Không thể tạo bác sĩ");
    }
};

const updateDoctor = async (req, res) => {
    try {
        const item = publicCatalogService.updateDoctor(req.params.id, req.body);
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
        const deleted = publicCatalogService.deleteDoctor(req.params.id);
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
};
