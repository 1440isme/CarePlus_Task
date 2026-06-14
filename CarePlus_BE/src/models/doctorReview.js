'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DoctorReview extends Model {
        static associate(models) {
            DoctorReview.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            DoctorReview.belongsTo(models.Doctor, {
                foreignKey: "doctorId",
                as: "doctor",
            });
        }
    }

    DoctorReview.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },
        doctorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "doctor_id",
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        visitDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "visit_date",
        },
        rewardPoints: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            field: "reward_points",
        },
        voucherCode: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: "voucher_code",
        },
    }, {
        sequelize,
        modelName: 'DoctorReview',
        tableName: 'doctor_reviews',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "doctor_id"],
            },
        ],
    });

    return DoctorReview;
};
