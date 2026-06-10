import publicCatalogService from "../services/publicCatalogService";

const getHomeData = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: await publicCatalogService.getHomeData(),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải dữ liệu trang chủ",
        });
    }
};

const getSpecialties = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            ...(await publicCatalogService.listSpecialties(req.query)),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải danh sách chuyên khoa",
        });
    }
};

const getSpecialtyDetail = async (req, res) => {
    try {
        const item = await publicCatalogService.getSpecialtyDetail(req.params.slugOrId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy chuyên khoa",
            });
        }

        return res.status(200).json({
            success: true,
            item,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải chi tiết chuyên khoa",
        });
    }
};

const getDoctors = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            ...(await publicCatalogService.listDoctors(req.query)),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải danh sách bác sĩ",
        });
    }
};

const getDoctorDetail = async (req, res) => {
    try {
        const item = await publicCatalogService.getDoctorDetail(req.params.slugOrId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bác sĩ",
            });
        }

        return res.status(200).json({
            success: true,
            item,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải chi tiết bác sĩ",
        });
    }
};

const getDoctorAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ngày cần tra cứu slot",
            });
        }

        const slots = await publicCatalogService.getAvailableSlots(req.params.slugOrId, date);
        if (slots === null) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bác sĩ",
            });
        }

        return res.status(200).json({
            success: true,
            slots,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải slot trống của bác sĩ",
        });
    }
};

const getArticles = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            ...publicCatalogService.listArticles(req.query),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải danh sách bài viết",
        });
    }
};

const getArticleDetail = async (req, res) => {
    try {
        const item = publicCatalogService.getArticleDetail(req.params.slugOrId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài viết",
            });
        }

        return res.status(200).json({
            success: true,
            item,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải chi tiết bài viết",
        });
    }
};

module.exports = {
    getHomeData,
    getSpecialties,
    getSpecialtyDetail,
    getDoctors,
    getDoctorDetail,
    getDoctorAvailableSlots,
    getArticles,
    getArticleDetail,
};
