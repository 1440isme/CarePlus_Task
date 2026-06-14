import axios from "./axios.customize";

/**
 * Lấy thông tin profile của user đang đăng nhập
 * GET /api/profile/me
 */
export const getMyProfile = () => {
    return axios.get("/api/profile/me");
};

/**
 * Cập nhật profile của user đang đăng nhập
 * PUT /api/profile/me
 * @param {Object} data - { firstName, lastName, phone, address, gender, avatar }
 */
export const updateMyProfile = (data) => {
    return axios.put("/api/profile/me", data);
};

export const getMyEngagement = () => {
    return axios.get("/api/profile/engagement");
};

export const toggleFavoriteDoctorApi = (doctorId) => {
    return axios.post(`/api/profile/favorite-doctors/${doctorId}/toggle`);
};

export const submitDoctorReviewApi = (payload) => {
    return axios.post("/api/profile/doctor-reviews", payload);
};

export const trackDoctorViewApi = (slugOrId) => {
    return axios.post(`/api/profile/recent-views/doctors/${slugOrId}`);
};

export const createAppointmentApi = (payload) => {
    return axios.post("/api/appointments", payload);
};

export const getMyAppointmentsApi = () => {
    return axios.get("/api/appointments/my");
};

export const cancelAppointmentApi = (appointmentId) => {
    return axios.patch(`/api/appointments/${appointmentId}/cancel`);
};

export const getMyRelativesApi = () => {
    return axios.get("/api/relatives/my");
};

export const createRelativeApi = (payload) => {
    return axios.post("/api/relatives", payload);
};

export const updateRelativeApi = (relativeId, payload) => {
    return axios.put(`/api/relatives/${relativeId}`, payload);
};

export const deleteRelativeApi = (relativeId) => {
    return axios.delete(`/api/relatives/${relativeId}`);
};

/**
 * Đăng nhập
 * POST /auth/login
 * @param {Object} credentials - { login, password }
 */
export const loginApi = (credentials) => {
    return axios.post("/auth/login", credentials);
};

/**
 * Gửi mã xác thực đăng ký
 * POST /api/send-verification-code
 * @param {Object} payload - { email, username }
 */
export const sendVerificationCodeApi = (payload) => {
    return axios.post("/api/send-verification-code", payload);
};

/**
 * Đăng ký tài khoản mới
 * POST /api/register
 * @param {Object} payload - { username, email, password, verificationCode }
 */
export const registerApi = (payload) => {
    return axios.post("/api/register", payload);
};

/**
 * Yêu cầu khôi phục mật khẩu
 * POST /api/forgot-password
 * @param {Object} payload - { email }
 */
export const forgotPasswordApi = (payload) => {
    return axios.post("/api/forgot-password", payload);
};

/**
 * Đặt lại mật khẩu
 * POST /api/reset-password
 * @param {Object} payload - { email, otpCode, newPassword }
 */
export const resetPasswordApi = (payload) => {
    return axios.post("/api/reset-password", payload);
};

/**
 * Lấy thông tin phiên đăng nhập hiện tại
 * GET /auth/me
 */
export const getCurrentSession = () => {
    return axios.get("/auth/me");
};

export const getPublicHomeData = () => {
    return axios.get("/api/public/home");
};

export const getSpecialties = (params) => {
    return axios.get("/api/public/specialties", { params });
};

export const getSpecialtyDetail = (slugOrId) => {
    return axios.get(`/api/public/specialties/${slugOrId}`);
};

export const getDoctors = (params) => {
    return axios.get("/api/public/doctors", { params });
};

export const getDoctorDetail = (slugOrId) => {
    return axios.get(`/api/public/doctors/${slugOrId}`);
};

export const getDoctorAvailableSlots = (slugOrId, date) => {
    return axios.get(`/api/public/doctors/${slugOrId}/available-slots`, {
        params: { date },
    });
};

export const getArticles = (params) => {
    return axios.get("/api/public/articles", { params });
};

export const getArticleDetail = (slugOrId) => {
    return axios.get(`/api/public/articles/${slugOrId}`);
};

export const getAllUsers = () => {
    return axios.get("/api/users");
};

export const getUserById = (userId) => {
    return axios.get(`/api/users/${userId}`);
};

export const createUserApi = (data) => {
    return axios.post("/api/users", data);
};

export const updateUserApi = (userId, data) => {
    return axios.put(`/api/users/${userId}`, data);
};

export const deleteUserApi = (userId) => {
    return axios.delete(`/api/users/${userId}`);
};

export const getAdminDashboard = () => {
    return axios.get("/api/admin/dashboard");
};

export const getAdminSpecialties = (params) => {
    return axios.get("/api/admin/specialties", { params });
};

export const createAdminSpecialty = (data) => {
    return axios.post("/api/admin/specialties", data);
};

export const updateAdminSpecialty = (specialtyId, data) => {
    return axios.put(`/api/admin/specialties/${specialtyId}`, data);
};

export const deleteAdminSpecialty = (specialtyId) => {
    return axios.delete(`/api/admin/specialties/${specialtyId}`);
};

export const getAdminDoctors = (params) => {
    return axios.get("/api/admin/doctors", { params });
};

export const createAdminDoctor = (data) => {
    return axios.post("/api/admin/doctors", data);
};

export const updateAdminDoctor = (doctorId, data) => {
    return axios.put(`/api/admin/doctors/${doctorId}`, data);
};

export const deleteAdminDoctor = (doctorId) => {
    return axios.delete(`/api/admin/doctors/${doctorId}`);
};

export const getAdminUsers = (params) => {
    return axios.get("/api/admin/users", { params });
};

export const createAdminUser = (data) => {
    return axios.post("/api/admin/users", data);
};

export const updateAdminUser = (userId, data) => {
    return axios.put(`/api/admin/users/${userId}`, data);
};

export const deleteAdminUser = (userId) => {
    return axios.delete(`/api/admin/users/${userId}`);
};

export const toggleAdminUserLock = (userId, locked) => {
    return axios.post(`/api/admin/users/${userId}/toggle-lock`, { locked });
};

export const toggleAdminUserBookingLock = (userId, payload) => {
    return axios.post(`/api/admin/users/${userId}/toggle-booking-lock`, payload);
};

export const resetAdminUserNoShow = (userId) => {
    return axios.post(`/api/admin/users/${userId}/reset-no-show`);
};
