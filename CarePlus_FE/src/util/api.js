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
 * Lấy thông tin phiên đăng nhập hiện tại
 * GET /auth/me
 */
export const getCurrentSession = () => {
    return axios.get("/auth/me");
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
