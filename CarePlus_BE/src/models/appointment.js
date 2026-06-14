'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        static associate(models) {
            Appointment.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            Appointment.belongsTo(models.Doctor, {
                foreignKey: "doctorId",
                as: "doctor",
            });
        }
    }

    Appointment.init({
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
        appointmentDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "appointment_date",
        },
        startTime: {
            type: DataTypes.STRING(5),
            allowNull: false,
            field: "start_time",
        },
        endTime: {
            type: DataTypes.STRING(5),
            allowNull: false,
            field: "end_time",
        },
        patientName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "patient_name",
        },
        patientPhone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: "patient_phone",
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        bookingQuantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: "booking_quantity",
        },
        status: {
            type: DataTypes.ENUM("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"),
            allowNull: false,
            defaultValue: "CONFIRMED",
        },
    }, {
        sequelize,
        modelName: 'Appointment',
        tableName: 'appointments',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ["doctor_id", "appointment_date", "start_time"],
            },
        ],
    });

    return Appointment;
};
