'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PatientVoucher extends Model {
        static associate(models) {
            PatientVoucher.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            PatientVoucher.belongsTo(models.DoctorReview, {
                foreignKey: "reviewId",
                as: "review",
            });
        }
    }

    PatientVoucher.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "review_id",
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        discountAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50000,
            field: "discount_amount",
        },
        minOrderValue: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 300000,
            field: "min_order_value",
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "expires_at",
        },
        isUsed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "is_used",
        },
    }, {
        sequelize,
        modelName: 'PatientVoucher',
        tableName: 'patient_vouchers',
        timestamps: true,
        underscored: true,
    });

    return PatientVoucher;
};
