'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasOne(models.PatientProfile, {
                foreignKey: "userId",
                as: "patientProfile",
            });
            User.hasMany(models.DoctorReview, {
                foreignKey: "userId",
                as: "doctorReviews",
            });
            User.hasMany(models.FavoriteDoctor, {
                foreignKey: "userId",
                as: "favoriteDoctors",
            });
            User.hasMany(models.DoctorViewHistory, {
                foreignKey: "userId",
                as: "doctorViewHistory",
            });
            User.hasOne(models.PatientRewardWallet, {
                foreignKey: "userId",
                as: "rewardWallet",
            });
            User.hasMany(models.PatientVoucher, {
                foreignKey: "userId",
                as: "vouchers",
            });
            User.hasMany(models.Appointment, {
                foreignKey: "userId",
                as: "appointments",
            });
            User.hasMany(models.RelativeProfile, {
                foreignKey: "userId",
                as: "relativeProfiles",
            });
        }
    }
    User.init({
        // --- Nhóm xác thực & Bảo mật ---
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // --- Nhóm thông tin cá nhân ---
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        gender: DataTypes.BOOLEAN, // true: Nam, false: Nữ
        phone: {
            type: DataTypes.STRING,
            unique: true
        },
        avatar: DataTypes.STRING,

        // --- Nhóm phân quyền (Dùng để check url /admin hay /user) ---
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false
        },

        // --- Nhóm quản lý OTP & Trạng thái kích hoạt ---
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // Mặc định chưa kích hoạt cho đến khi nhập đúng OTP mail
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        isLocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        failedLoginAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        lockUntil: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        otpCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        otpExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users', // Đảm bảo tên bảng khớp với DB
        timestamps: true,   // Tự động quản lý createdAt và updatedAt
    });
    return User;
};
