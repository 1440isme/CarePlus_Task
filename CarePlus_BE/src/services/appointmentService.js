import db from "../models/index";
import CRUDService from "./CRUDService";
import notificationService from "./notificationService";

const ACTIVE_APPOINTMENT_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED"];

const shiftSlots = {
    MORNING: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"],
    AFTERNOON: ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
};

const formatCompactMoney = (amount) => {
    const numeric = Number(amount) || 0;
    if (!numeric) return "0K";
    return `${Math.round(numeric / 1000)}K`;
};

const toJson = (instance) => (typeof instance?.toJSON === "function" ? instance.toJSON() : instance);

const resolveDoctor = async (slugOrId, options = {}) => {
    const isId = !isNaN(slugOrId) && String(slugOrId).trim() !== "";
    const where = isId ? { id: Number(slugOrId) } : { slug: slugOrId };
    where.is_active = true;

    return db.Doctor.findOne({
        where,
        include: [{ model: db.Specialty, as: "specialty" }],
        ...options,
    });
};

const parseJsonField = (value, fallback = []) => {
    if (Array.isArray(value)) return value;
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        return fallback;
    }
};

const buildRawSlotsForDoctor = (doctor, dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        const error = new Error("Ngày khám không hợp lệ");
        error.status = 400;
        throw error;
    }

    const doctorJson = toJson(doctor);
    const day = date.getDay();
    const availabilityDays = parseJsonField(doctorJson.availabilityDays, []);
    if (!availabilityDays.includes(day)) {
        return [];
    }

    const shifts = parseJsonField(doctorJson.shifts, []);
    const slotPool = shifts.flatMap((shift) => shiftSlots[shift] || []);
    const limited = slotPool.slice(0, Math.max(Number(doctorJson.availableSlotsToday) || 0, 0));

    return limited.map((startTime) => {
        const [hour, minute] = startTime.split(":").map(Number);
        const end = new Date(date);
        end.setHours(hour, minute + 30, 0, 0);
        return {
            startTime,
            endTime: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
        };
    });
};

const getBookedTimes = async (doctorId, appointmentDate, transaction) => {
    const appointments = await db.Appointment.findAll({
        where: {
            doctorId,
            appointmentDate,
            status: { [db.Sequelize.Op.in]: ACTIVE_APPOINTMENT_STATUSES },
        },
        attributes: ["startTime"],
        transaction,
    });

    return new Set(appointments.map((item) => item.startTime));
};

const getAvailableSlotsForDoctor = async (doctor, appointmentDate, transaction) => {
    const rawSlots = buildRawSlotsForDoctor(doctor, appointmentDate);
    const bookedTimes = await getBookedTimes(doctor.id, appointmentDate, transaction);

    return rawSlots.map((slot) => ({
        ...slot,
        available: !bookedTimes.has(slot.startTime),
    }));
};

const mapAppointmentOutput = (appointmentInstance) => {
    const appointment = toJson(appointmentInstance);
    return {
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone,
        note: appointment.note,
        bookingQuantity: appointment.bookingQuantity,
        status: appointment.status,
        createdAt: appointment.createdAt,
        doctor: appointment.doctor ? {
            id: appointment.doctor.id,
            slug: appointment.doctor.slug,
            fullName: appointment.doctor.fullName,
            title: appointment.doctor.title,
            image: appointment.doctor.image,
            consultationFee: appointment.doctor.consultationFee,
            consultationFeeLabel: formatCompactMoney(appointment.doctor.consultationFee),
            specialty: appointment.doctor.specialty ? {
                id: appointment.doctor.specialty.id,
                name: appointment.doctor.specialty.name,
                slug: appointment.doctor.specialty.slug,
            } : null,
        } : null,
    };
};

const createAppointment = async (userId, payload = {}) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findByPk(userId, { transaction });
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        if (user.role !== "user") {
            throw new Error("Chỉ bệnh nhân mới có thể đặt lịch khám");
        }

        const profile = await CRUDService.ensurePatientProfile(user, transaction);
        if (profile?.bookingLocked) {
            throw new Error(profile.bookingLockedReason || "Tài khoản của bạn đang bị khóa quyền đặt lịch");
        }

        const doctor = await resolveDoctor(payload.doctorId || payload.slugOrId, { transaction });
        if (!doctor) {
            throw new Error("Không tìm thấy bác sĩ");
        }

        const appointmentDate = String(payload.appointmentDate || "").trim();
        const startTime = String(payload.startTime || "").trim();
        const patientName = String(payload.patientName || profile?.fullName || "").trim();
        const patientPhone = String(payload.patientPhone || user.phone || "").trim();
        const note = String(payload.note || "").trim() || null;
        const bookingQuantity = Math.max(1, Number(payload.bookingQuantity) || 1);

        if (!appointmentDate || !startTime) {
            throw new Error("Vui lòng chọn ngày khám và khung giờ");
        }

        if (!patientName || !patientPhone) {
            throw new Error("Vui lòng nhập đầy đủ họ tên và số điện thoại bệnh nhân");
        }

        const slots = await getAvailableSlotsForDoctor(doctor, appointmentDate, transaction);
        const selectedSlot = slots.find((slot) => slot.startTime === startTime);
        if (!selectedSlot) {
            throw new Error("Khung giờ đã chọn không thuộc lịch làm việc của bác sĩ");
        }

        if (!selectedSlot.available) {
            throw new Error("Khung giờ này vừa được người khác đặt. Vui lòng chọn khung giờ khác.");
        }

        const duplicateSameDay = await db.Appointment.findOne({
            where: {
                userId,
                doctorId: doctor.id,
                appointmentDate,
                startTime,
                status: { [db.Sequelize.Op.in]: ["PENDING", "CONFIRMED"] },
            },
            transaction,
        });
        if (duplicateSameDay) {
            throw new Error("Bạn đã có lịch hẹn ở khung giờ này rồi");
        }

        const appointment = await db.Appointment.create({
            userId,
            doctorId: doctor.id,
            appointmentDate,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            patientName,
            patientPhone,
            note,
            bookingQuantity,
            status: "CONFIRMED",
        }, { transaction });

        doctor.bookedCount = (doctor.bookedCount || 0) + 1;
        await doctor.save({ transaction });

        await notificationService.createForUsers([userId], {
            title: "Đặt lịch thành công",
            message: `Lịch khám với ${doctor.fullName} vào ${appointmentDate} lúc ${selectedSlot.startTime} đã được xác nhận.`,
            type: "appointment_confirmed",
            link: "/user/profile",
        }, { transaction });

        await notificationService.notifyAdmins({
            title: "Lịch hẹn mới",
            message: `${patientName} vừa đặt lịch với ${doctor.fullName} vào ${appointmentDate} lúc ${selectedSlot.startTime}.`,
            type: "appointment_new",
            link: "/admin/dashboard",
        }, { transaction });

        await transaction.commit();

        const refetched = await db.Appointment.findByPk(appointment.id, {
            include: [{
                model: db.Doctor,
                as: "doctor",
                include: [{ model: db.Specialty, as: "specialty" }],
            }],
        });

        return mapAppointmentOutput(refetched);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getMyAppointments = async (userId) => {
    const appointments = await db.Appointment.findAll({
        where: { userId },
        include: [{
            model: db.Doctor,
            as: "doctor",
            include: [{ model: db.Specialty, as: "specialty" }],
        }],
        order: [
            ["appointmentDate", "ASC"],
            ["startTime", "ASC"],
        ],
    });

    return appointments.map(mapAppointmentOutput);
};

const cancelAppointment = async (userId, appointmentId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const appointment = await db.Appointment.findOne({
            where: { id: appointmentId, userId },
            include: [{ model: db.Doctor, as: "doctor" }],
            transaction,
        });

        if (!appointment) {
            const error = new Error("Không tìm thấy lịch hẹn");
            error.status = 404;
            throw error;
        }

        if (appointment.status === "CANCELLED") {
            throw new Error("Lịch hẹn này đã được hủy trước đó");
        }

        if (appointment.status === "COMPLETED") {
            throw new Error("Không thể hủy lịch hẹn đã hoàn tất");
        }

        appointment.status = "CANCELLED";
        await appointment.save({ transaction });

        if (appointment.doctor) {
            appointment.doctor.bookedCount = Math.max(0, (appointment.doctor.bookedCount || 0) - 1);
            await appointment.doctor.save({ transaction });
        }

        await notificationService.createForUsers([userId], {
            title: "Đã hủy lịch hẹn",
            message: `Lịch khám với ${appointment.doctor?.fullName || "bác sĩ"} vào ${appointment.appointmentDate} lúc ${appointment.startTime} đã được hủy.`,
            type: "appointment_cancelled",
            link: "/user/profile",
        }, { transaction });

        await notificationService.notifyAdmins({
            title: "Bệnh nhân hủy lịch",
            message: `${appointment.patientName} đã hủy lịch với ${appointment.doctor?.fullName || "bác sĩ"} vào ${appointment.appointmentDate} lúc ${appointment.startTime}.`,
            type: "appointment_cancelled",
            link: "/admin/dashboard",
        }, { transaction });

        await transaction.commit();
        return { id: appointment.id, status: appointment.status };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    buildRawSlotsForDoctor,
    getAvailableSlotsForDoctor,
    createAppointment,
    getMyAppointments,
    cancelAppointment,
};
