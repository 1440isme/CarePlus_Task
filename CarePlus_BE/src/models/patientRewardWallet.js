'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PatientRewardWallet extends Model {
        static associate(models) {
            PatientRewardWallet.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
        }
    }

    PatientRewardWallet.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: "user_id",
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        totalEarned: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "total_earned",
        },
    }, {
        sequelize,
        modelName: 'PatientRewardWallet',
        tableName: 'patient_reward_wallets',
        timestamps: true,
        underscored: true,
    });

    return PatientRewardWallet;
};
