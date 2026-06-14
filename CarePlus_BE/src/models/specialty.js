'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        static associate(models) {
            Specialty.hasMany(models.Doctor, {
                foreignKey: "specialtyId",
                as: "doctors",
            });
        }
    }

    Specialty.init({
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        slug: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        summary: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        icon: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: "🩺",
        },
        color: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: "from-sky-50 to-cyan-50",
        },
        popularityRank: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1,
            field: "popularity_rank",
        },
        coverImage: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: "cover_image",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "is_active",
        },
    }, {
        sequelize,
        modelName: 'Specialty',
        tableName: 'specialties',
        timestamps: true,
        underscored: true,
    });

    return Specialty;
};
