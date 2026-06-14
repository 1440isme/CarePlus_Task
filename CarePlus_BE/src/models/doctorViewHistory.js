'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DoctorViewHistory extends Model {
        static associate(models) {
            DoctorViewHistory.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            DoctorViewHistory.belongsTo(models.Doctor, {
                foreignKey: "doctorId",
                as: "doctor",
            });
        }
    }

    DoctorViewHistory.init({
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
        viewedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "viewed_at",
        },
    }, {
        sequelize,
        modelName: 'DoctorViewHistory',
        tableName: 'doctor_view_histories',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "doctor_id"],
            },
        ],
    });

    return DoctorViewHistory;
};
