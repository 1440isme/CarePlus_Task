'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
        }
    }

    Notification.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },
        title: {
            type: DataTypes.STRING(160),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "system",
        },
        link: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "is_read",
        },
        readAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "read_at",
        },
    }, {
        sequelize,
        modelName: 'Notification',
        tableName: 'notifications',
        timestamps: true,
        underscored: true,
    });

    return Notification;
};
