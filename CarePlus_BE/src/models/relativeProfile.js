'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RelativeProfile extends Model {
        static associate(models) {
            RelativeProfile.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
        }
    }

    RelativeProfile.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },
        fullName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "full_name",
        },
        relationship: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
            allowNull: true,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "date_of_birth",
        },
        note: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        isPrimary: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "is_primary",
        },
    }, {
        sequelize,
        modelName: 'RelativeProfile',
        tableName: 'relative_profiles',
        timestamps: true,
        underscored: true,
    });

    return RelativeProfile;
};
