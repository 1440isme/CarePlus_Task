'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true // Đảm bảo không trùng tài khoản
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.BOOLEAN // true: Nam, false: Nữ
            },
            phone: {
                type: Sequelize.STRING,
                unique: true
            },
            avatar: {
                type: Sequelize.STRING
            },

            // --- Cải tiến cho Phân quyền ---
            role: {
                type: Sequelize.ENUM('user', 'admin'),
                defaultValue: 'user',
                allowNull: false
            },

            // --- Cải tiến cho OTP & Xác thực ---
            isVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            otpCode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            otpExpiresAt: {
                type: Sequelize.DATE,
                allowNull: true
            },

            // --- Timestamps ---
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');

    }
};