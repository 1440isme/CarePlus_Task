import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);
const safeUserAttributes = {
    exclude: ["password", "otpCode"],
};

const parseBooleanField = (value) => {
    if (value === "" || value === null || typeof value === "undefined") {
        return null;
    }

    return value === "1" || value === 1 || value === true || value === "true";
};

let createNewUser = async (data) => {
    if (!data?.username || !data?.email || !data?.password) {
        throw new Error("Username, email và mật khẩu là bắt buộc");
    }

    let hashPasswordFromBcrypt = bcrypt.hashSync(data.password, salt);
    await db.User.create({
        username: data.username.trim(),
        email: data.email.trim(),
        password: hashPasswordFromBcrypt,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        address: data.address || null,
        gender: parseBooleanField(data.gender),
        phone: data.phone || null,
        avatar: data.avatar || null,
        role: data.role === "admin" ? "admin" : "user",
        isActive: typeof data.isActive === "undefined" ? true : parseBooleanField(data.isActive),
        isLocked: typeof data.isLocked === "undefined" ? false : parseBooleanField(data.isLocked),
    });

    return "OK: Create new user successfully";
};

let hashUserPassword = async (password) => {
    return bcrypt.hashSync(password, salt);
};

let getAllUsers = async () => {
    return db.User.findAll({
        attributes: safeUserAttributes,
        raw: true,
        order: [["id", "DESC"]],
    });
};

let getUserInfoById = async (userId) => {
    return db.User.findOne({
        where: { id: userId },
        attributes: safeUserAttributes,
        raw: true,
    });
};

let updateUserData = async (data) => {
    let user = await db.User.findOne({
        where: { id: data.id },
    });

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    if (data.username) user.username = data.username.trim();
    if (data.email) user.email = data.email.trim();
    if (typeof data.firstName !== "undefined") user.firstName = data.firstName || null;
    if (typeof data.lastName !== "undefined") user.lastName = data.lastName || null;
    if (typeof data.address !== "undefined") user.address = data.address || null;
    if (typeof data.gender !== "undefined") user.gender = parseBooleanField(data.gender);
    if (typeof data.phone !== "undefined") user.phone = data.phone || null;
    if (typeof data.avatar !== "undefined") user.avatar = data.avatar || null;
    if (data.role) user.role = data.role === "admin" ? "admin" : "user";
    if (typeof data.isActive !== "undefined") user.isActive = parseBooleanField(data.isActive);
    if (typeof data.isLocked !== "undefined") user.isLocked = parseBooleanField(data.isLocked);
    if (data.password) {
        user.password = await hashUserPassword(data.password);
    }

    await user.save();
    return getAllUsers();
};

let deleteUserById = async (userId) => {
    let user = await db.User.findOne({
        where: { id: userId },
    });

    if (user) {
        await user.destroy();
    }
};

module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    getAllUsers: getAllUsers,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
};
import bcrypt from "bcryptjs";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data?.email || !data?.password) {
                resolve("Thiếu email hoặc mật khẩu");
                return;
            }

            let hashPasswordFromBcrypt = bcrypt.hashSync(data.password, salt);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address || null,
                gender: data.gender === "1" || data.gender === 1 || data.gender === true,
                phone: data.phone || null,
                phone: data.phone || null,
                avatar: data.avatar || null,
                role: data.role === "admin" ? "admin" : "user",
            });
            resolve('OK: Create new user successfully');
        } catch (error) {
            reject(error);
        }
    });
}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await bcrypt.hashSync(password, salt);
            resolve(hashPasswordFromBcrypt);
        } catch (error) {
            reject(error);
        }
    });
}
let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
}
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}
// Retrieve user by email
const getUserInfoByEmail = async (email) => {
  try {
    const user = await db.User.findOne({ where: { email }, raw: true });
    return user;
  } catch (e) {
    throw e;
  }
};

// Update OTP and expiration for a user
const updateUserOTP = async (email, otp, expiresAt) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    user.otpCode = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();
  } catch (e) {
    throw e;
  }
};

// Update password and set verified flag
const updateUserPasswordAndVerify = async (email, newPassword) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    const hashed = await hashUserPassword(newPassword);
    user.password = hashed;
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();
  } catch (e) {
    throw e;
  }
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
            });
            if (user) {
                if (data.email) user.email = data.email;
                if (typeof data.firstName !== "undefined") user.firstName = data.firstName;
                if (typeof data.lastName !== "undefined") user.lastName = data.lastName;
                if (typeof data.address !== "undefined") user.address = data.address;
                if (typeof data.gender !== "undefined") {
                    user.gender = data.gender === "1" || data.gender === 1 || data.gender === true;
                }
                if (typeof data.phone !== "undefined") user.phone = data.phone;
                if (typeof data.avatar !== "undefined") user.avatar = data.avatar;
                if (data.role) user.role = data.role === "admin" ? "admin" : "user";
                if (data.password) {
                    user.password = await hashUserPassword(data.password);
                }
                await user.save();
                let allUsers = await db.User.findAll({ raw: true });
                resolve(allUsers);
            } else {
                reject('');
            }
        }
        catch (error) {
            reject(error);
        }
    });
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (user) {
                await user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    getAllUsers: getAllUsers,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
    getUserInfoByEmail: getUserInfoByEmail,
    updateUserOTP: updateUserOTP,
    updateUserPasswordAndVerify: updateUserPasswordAndVerify,
}
