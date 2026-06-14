'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Doctor extends Model {
        static associate(models) {
            Doctor.belongsTo(models.Specialty, {
                foreignKey: "specialtyId",
                as: "specialty",
            });
            Doctor.hasMany(models.DoctorReview, {
                foreignKey: "doctorId",
                as: "reviews",
            });
            Doctor.hasMany(models.FavoriteDoctor, {
                foreignKey: "doctorId",
                as: "favorites",
            });
            Doctor.hasMany(models.DoctorViewHistory, {
                foreignKey: "doctorId",
                as: "views",
            });
            Doctor.hasMany(models.Appointment, {
                foreignKey: "doctorId",
                as: "appointments",
            });
        }
    }

    Doctor.init({
        fullName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "full_name",
        },
        slug: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        specialtyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "specialty_id",
        },
        gender: {
            type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
            allowNull: false,
            defaultValue: "OTHER",
        },
        experienceYears: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "experience_years",
        },
        consultationFee: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "consultation_fee",
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 4.5,
        },
        bookedCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "booked_count",
        },
        availableSlotsToday: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "available_slots_today",
        },
        image: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        highlights: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        gallery: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        availabilityDays: {
            type: DataTypes.JSON,
            allowNull: true,
            field: "availability_days",
        },
        shifts: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        hospital: {
            type: DataTypes.STRING(150),
            allowNull: false,
            defaultValue: "CarePlus Clinic",
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "is_featured",
        },
        isTopBooked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "is_top_booked",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "is_active",
        },
    }, {
        sequelize,
        modelName: 'Doctor',
        tableName: 'doctors',
        timestamps: true,
        underscored: true,
    });

    return Doctor;
};
