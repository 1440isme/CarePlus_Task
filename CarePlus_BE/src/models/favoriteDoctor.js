'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FavoriteDoctor extends Model {
        static associate(models) {
            FavoriteDoctor.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            FavoriteDoctor.belongsTo(models.Doctor, {
                foreignKey: "doctorId",
                as: "doctor",
            });
        }
    }

    FavoriteDoctor.init({
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
    }, {
        sequelize,
        modelName: 'FavoriteDoctor',
        tableName: 'favorite_doctors',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "doctor_id"],
            },
        ],
    });

    return FavoriteDoctor;
};
