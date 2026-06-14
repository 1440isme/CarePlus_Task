import appointmentService from "../services/appointmentService";

const createAppointment = async (req, res) => {
    try {
        const item = await appointmentService.createAppointment(req.user.id, req.body);
        return res.status(201).json({
            success: true,
            item,
            message: "Đặt lịch khám thành công",
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Không thể đặt lịch khám",
        });
    }
};

const getMyAppointments = async (req, res) => {
    try {
        const items = await appointmentService.getMyAppointments(req.user.id);
        return res.status(200).json({
            success: true,
            items,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Không thể tải danh sách lịch hẹn",
        });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const item = await appointmentService.cancelAppointment(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            item,
            message: "Đã hủy lịch hẹn",
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Không thể hủy lịch hẹn",
        });
    }
};

module.exports = {
    createAppointment,
    getMyAppointments,
    cancelAppointment,
};
