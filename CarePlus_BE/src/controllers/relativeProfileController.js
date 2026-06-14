import relativeProfileService from "../services/relativeProfileService";

const listMyRelatives = async (req, res) => {
    try {
        const items = await relativeProfileService.listMyRelatives(req.user.id);
        return res.status(200).json({
            success: true,
            items,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Không thể tải hồ sơ người thân",
        });
    }
};

const createRelative = async (req, res) => {
    try {
        const item = await relativeProfileService.createRelative(req.user.id, req.body);
        return res.status(201).json({
            success: true,
            item,
            message: "Đã thêm hồ sơ người thân",
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Không thể thêm hồ sơ người thân",
        });
    }
};

const updateRelative = async (req, res) => {
    try {
        const item = await relativeProfileService.updateRelative(req.user.id, req.params.id, req.body);
        return res.status(200).json({
            success: true,
            item,
            message: "Đã cập nhật hồ sơ người thân",
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Không thể cập nhật hồ sơ người thân",
        });
    }
};

const deleteRelative = async (req, res) => {
    try {
        await relativeProfileService.deleteRelative(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Đã xóa hồ sơ người thân",
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Không thể xóa hồ sơ người thân",
        });
    }
};

module.exports = {
    listMyRelatives,
    createRelative,
    updateRelative,
    deleteRelative,
};
