'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('specialties', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true,
            },
            slug: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true,
            },
            summary: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            icon: {
                type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue: "🩺",
            },
            color: {
                type: Sequelize.STRING(100),
                allowNull: true,
                defaultValue: "from-sky-50 to-cyan-50",
            },
            popularity_rank: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
            cover_image: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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
        await queryInterface.bulkInsert('specialties', [
            {
                id: 1,
                slug: "co-xuong-khop",
                name: "Cơ Xương Khớp",
                summary: "Chẩn đoán và điều trị các bệnh lý xương khớp, cột sống và vận động.",
                description: "Chuyên khoa hỗ trợ khám đau lưng, thoái hóa khớp, chấn thương thể thao và phục hồi chức năng vận động.",
                icon: "🦴",
                color: "from-rose-50 to-orange-50",
                popularity_rank: 1,
                is_active: true,
                cover_image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: 2,
                slug: "tim-mach",
                name: "Tim mạch",
                summary: "Khám và theo dõi các bệnh tim mạch, huyết áp, mỡ máu.",
                description: "Tập trung kiểm tra sức khỏe tim mạch, nguy cơ đột quỵ, rối loạn nhịp tim và tư vấn dự phòng lâu dài.",
                icon: "❤️",
                color: "from-sky-50 to-cyan-50",
                popularity_rank: 2,
                is_active: true,
                cover_image: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: 3,
                slug: "tai-mui-hong",
                name: "Tai Mũi Họng",
                summary: "Khám viêm xoang, viêm họng, ù tai, các bệnh lý đường hô hấp trên.",
                description: "Hỗ trợ điều trị viêm amidan, viêm xoang, rối loạn thính lực và các vấn đề tai mũi họng thường gặp.",
                icon: "👂",
                color: "from-emerald-50 to-teal-50",
                popularity_rank: 3,
                is_active: true,
                cover_image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: 4,
                slug: "nhi-khoa",
                name: "Nhi khoa",
                summary: "Theo dõi sức khỏe, dinh dưỡng và điều trị các bệnh lý thường gặp ở trẻ.",
                description: "Đánh giá tăng trưởng, dinh dưỡng, sức đề kháng và điều trị các bệnh lý hô hấp, tiêu hóa ở trẻ em.",
                icon: "🧒",
                color: "from-violet-50 to-fuchsia-50",
                popularity_rank: 4,
                is_active: true,
                cover_image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: 5,
                slug: "da-lieu",
                name: "Da liễu",
                summary: "Điều trị mụn, viêm da, nám da, rụng tóc và chăm sóc da chuyên sâu.",
                description: "Khám và điều trị các vấn đề da liễu thường gặp, tư vấn phác đồ chăm sóc da phù hợp từng tình trạng.",
                icon: "✨",
                color: "from-amber-50 to-yellow-50",
                popularity_rank: 5,
                is_active: true,
                cover_image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: 6,
                slug: "tieu-hoa",
                name: "Tiêu hóa",
                summary: "Khám đau dạ dày, đại tràng, trào ngược và các bệnh lý đường tiêu hóa.",
                description: "Tư vấn, nội soi, theo dõi bệnh lý dạ dày, đại tràng, gan mật và điều chỉnh chế độ ăn hỗ trợ điều trị.",
                icon: "🌿",
                color: "from-lime-50 to-emerald-50",
                popularity_rank: 6,
                is_active: true,
                cover_image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: 7,
                slug: "san-phu-khoa",
                name: "Sản Phụ khoa",
                summary: "Theo dõi sức khỏe phụ khoa, thai sản và tư vấn chăm sóc toàn diện.",
                description: "Khám phụ khoa định kỳ, tư vấn sức khỏe sinh sản, thai kỳ và kế hoạch chăm sóc trước sau sinh.",
                icon: "💗",
                color: "from-pink-50 to-rose-50",
                popularity_rank: 7,
                is_active: true,
                cover_image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: 8,
                slug: "noi-tong-quat",
                name: "Nội tổng quát",
                summary: "Khám tổng quát, tầm soát bệnh lý mạn tính và chăm sóc sức khỏe định kỳ.",
                description: "Đánh giá toàn diện tình trạng sức khỏe, tầm soát sớm bệnh lý và lập kế hoạch theo dõi cá nhân hóa.",
                icon: "🩺",
                color: "from-slate-50 to-blue-50",
                popularity_rank: 8,
                is_active: true,
                cover_image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('specialties');
    }
};
