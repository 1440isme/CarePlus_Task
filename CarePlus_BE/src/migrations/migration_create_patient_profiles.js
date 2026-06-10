'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('patient_profiles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            full_name: {
                type: Sequelize.STRING(150),
                allowNull: false,
            },
            gender: {
                type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
                allowNull: true,
            },
            date_of_birth: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            address: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            no_show_count: {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            booking_locked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            booking_locked_reason: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            booking_locked_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.sequelize.query(`
            INSERT INTO patient_profiles (
                user_id,
                full_name,
                gender,
                date_of_birth,
                address,
                no_show_count,
                booking_locked,
                booking_locked_reason,
                booking_locked_at,
                created_at,
                updated_at
            )
            SELECT
                id,
                CASE
                    WHEN TRIM(CONCAT(COALESCE(firstName, ''), ' ', COALESCE(lastName, ''))) <> ''
                        THEN TRIM(CONCAT(COALESCE(firstName, ''), ' ', COALESCE(lastName, '')))
                    WHEN username IS NOT NULL AND username <> ''
                        THEN username
                    ELSE email
                END AS full_name,
                CASE
                    WHEN gender = 1 THEN 'MALE'
                    WHEN gender = 0 THEN 'FEMALE'
                    ELSE NULL
                END AS gender,
                NULL AS date_of_birth,
                address,
                0 AS no_show_count,
                0 AS booking_locked,
                NULL AS booking_locked_reason,
                NULL AS booking_locked_at,
                createdAt,
                updatedAt
            FROM Users
            WHERE role = 'user'
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('patient_profiles');
    }
};
