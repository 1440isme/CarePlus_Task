'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('doctors', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            full_name: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true
            },
            title: {
                type: Sequelize.STRING(150),
                allowNull: true
            },
            specialty_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'specialties',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            gender: {
                type: Sequelize.ENUM("MALE", "FEMALE", "OTHER"),
                allowNull: false,
                defaultValue: "OTHER"
            },
            experience_years: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            consultation_fee: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            rating: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 4.5
            },
            booked_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            available_slots_today: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            image: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            bio: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            highlights: {
                type: Sequelize.JSON,
                allowNull: true
            },
            gallery: {
                type: Sequelize.JSON,
                allowNull: true
            },
            availability_days: {
                type: Sequelize.JSON,
                allowNull: true
            },
            shifts: {
                type: Sequelize.JSON,
                allowNull: true
            },
            hospital: {
                type: Sequelize.STRING(150),
                allowNull: false,
                defaultValue: "CarePlus Clinic"
            },
            is_featured: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            is_top_booked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Seed data
        await queryInterface.bulkInsert('doctors', [
            {
                id: 101,
                slug: "dr-nguyen-thanh-hung",
                specialty_id: 2,
                full_name: "TS.BS Nguyễn Thanh Hùng",
                title: "Bác sĩ Tim mạch",
                gender: "MALE",
                experience_years: 14,
                consultation_fee: 420000,
                rating: 4.9,
                booked_count: 328,
                available_slots_today: 5,
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
                bio: "Chuyên sâu điều trị tăng huyết áp, suy tim và dự phòng biến chứng tim mạch.",
                highlights: '["14 năm kinh nghiệm", "Tư vấn phòng ngừa đột quỵ", "Theo dõi bệnh lý mạn tính"]',
                gallery: '["https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80"]',
                availability_days: '[1, 2, 3, 4, 5]',
                shifts: '["MORNING", "AFTERNOON"]',
                hospital: "CarePlus Clinic",
                is_featured: true,
                is_top_booked: true,
                is_active: true
            },
            {
                id: 102,
                slug: "dr-tran-thi-ngoc-lan",
                specialty_id: 1,
                full_name: "BS Trần Thị Ngọc Lan",
                title: "Bác sĩ Cơ Xương Khớp",
                gender: "FEMALE",
                experience_years: 11,
                consultation_fee: 380000,
                rating: 4.8,
                booked_count: 287,
                available_slots_today: 4,
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
                bio: "Điều trị đau vai gáy, thoái hóa cột sống và các bệnh lý khớp mạn tính.",
                highlights: '["Phác đồ phục hồi vận động", "Theo dõi đau lưng mạn tính", "Tư vấn chấn thương thể thao"]',
                gallery: '["https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=80"]',
                availability_days: '[1, 3, 5, 6]',
                shifts: '["MORNING"]',
                hospital: "CarePlus Clinic",
                is_featured: true,
                is_top_booked: true,
                is_active: true
            },
            {
                id: 103,
                slug: "dr-le-minh-quan",
                specialty_id: 3,
                full_name: "BS Lê Minh Quân",
                title: "Bác sĩ Tai Mũi Họng",
                gender: "MALE",
                experience_years: 9,
                consultation_fee: 320000,
                rating: 4.7,
                booked_count: 190,
                available_slots_today: 6,
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80",
                bio: "Điều trị viêm xoang, viêm họng kéo dài và rối loạn giọng nói.",
                highlights: '["Nội soi tai mũi họng", "Tư vấn viêm xoang mạn", "Điều trị ù tai"]',
                gallery: '["https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1511174511562-5f97f4f4a54a?auto=format&fit=crop&w=1200&q=80"]',
                availability_days: '[2, 4, 6]',
                shifts: '["AFTERNOON"]',
                hospital: "CarePlus Clinic",
                is_featured: false,
                is_top_booked: false,
                is_active: true
            },
            {
                id: 104,
                slug: "dr-pham-thu-ha",
                specialty_id: 4,
                full_name: "BS Phạm Thu Hà",
                title: "Bác sĩ Nhi khoa",
                gender: "FEMALE",
                experience_years: 12,
                consultation_fee: 350000,
                rating: 4.9,
                booked_count: 244,
                available_slots_today: 3,
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
                bio: "Theo dõi sức khỏe trẻ em, tư vấn dinh dưỡng và điều trị bệnh hô hấp thường gặp.",
                highlights: '["Khám dinh dưỡng trẻ em", "Theo dõi tăng trưởng", "Hỗ trợ bệnh hô hấp"]',
                gallery: '["https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1200&q=80"]',
                availability_days: '[1, 2, 4, 5]',
                shifts: '["MORNING", "AFTERNOON"]',
                hospital: "CarePlus Clinic",
                is_featured: true,
                is_top_booked: true,
                is_active: true
            },
            {
                id: 105,
                slug: "dr-vo-hoang-yen",
                specialty_id: 5,
                full_name: "BS Võ Hoàng Yến",
                title: "Bác sĩ Da liễu",
                gender: "FEMALE",
                experience_years: 8,
                consultation_fee: 360000,
                rating: 4.6,
                booked_count: 156,
                available_slots_today: 7,
                image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=900&q=80",
                bio: "Chuyên trị mụn, viêm da cơ địa, nám da và chăm sóc da chuyên sâu.",
                highlights: '["Điều trị mụn cá nhân hóa", "Chăm sóc da nhạy cảm", "Tư vấn nám da"]',
                gallery: '["https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"]',
                availability_days: '[1, 3, 5]',
                shifts: '["AFTERNOON"]',
                hospital: "CarePlus Clinic",
                is_featured: false,
                is_top_booked: false,
                is_active: true
            },
            {
                id: 106,
                slug: "dr-do-quoc-bao",
                specialty_id: 6,
                full_name: "BS Đỗ Quốc Bảo",
                title: "Bác sĩ Tiêu hóa",
                gender: "MALE",
                experience_years: 10,
                consultation_fee: 390000,
                rating: 4.8,
                booked_count: 210,
                available_slots_today: 4,
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80",
                bio: "Theo dõi bệnh dạ dày, đại tràng, gan mật và tư vấn chế độ ăn hỗ trợ điều trị.",
                highlights: '["Theo dõi dạ dày mạn tính", "Tư vấn đại tràng kích thích", "Điều chỉnh chế độ ăn"]',
                gallery: '["https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1631815588090-d1bcbe9a0a5c?auto=format&fit=crop&w=1200&q=80"]',
                availability_days: '[2, 3, 5, 6]',
                shifts: '["MORNING"]',
                hospital: "CarePlus Clinic",
                is_featured: false,
                is_top_booked: true,
                is_active: true
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('doctors');
    }
};
