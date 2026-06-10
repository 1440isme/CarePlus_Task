'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PatientProfile extends Model {
        static associate(models) {
            PatientProfile.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
        }
    }

    PatientProfile.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: "user_id",
        },
        fullName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "full_name",
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
        address: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        noShowCount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
            field: "no_show_count",
        },
        bookingLocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "booking_locked",
        },
        bookingLockedReason: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: "booking_locked_reason",
        },
        bookingLockedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "booking_locked_at",
        },
    }, {
        sequelize,
        modelName: 'PatientProfile',
        tableName: 'patient_profiles',
        timestamps: true,
        underscored: true,
    });

    return PatientProfile;
};
