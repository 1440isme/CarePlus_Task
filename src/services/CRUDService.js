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
}