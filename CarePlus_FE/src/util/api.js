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
