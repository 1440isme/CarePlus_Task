import db from "../models/index";

const DEFAULT_SPECIALTIES = [
    {
        name: "Tim mạch",
        slug: "tim-mach",
        summary: "Khám và theo dõi các bệnh tim mạch, huyết áp và mỡ máu.",
        description: "Phù hợp cho bệnh nhân cần tầm soát nguy cơ tim mạch, theo dõi huyết áp và điều trị dài hạn.",
        icon: "❤️",
        color: "from-sky-50 to-cyan-50",
        popularityRank: 1,
        coverImage: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
    },
    {
        name: "Cơ Xương Khớp",
        slug: "co-xuong-khop",
        summary: "Điều trị đau lưng, đau vai gáy và các bệnh lý xương khớp mạn tính.",
        description: "Hỗ trợ chẩn đoán, phục hồi vận động và xây dựng phác đồ chăm sóc lâu dài.",
        icon: "🦴",
        color: "from-rose-50 to-orange-50",
        popularityRank: 2,
        coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
    },
    {
        name: "Nhi khoa",
        slug: "nhi-khoa",
        summary: "Theo dõi sức khỏe, dinh dưỡng và bệnh lý thường gặp ở trẻ.",
        description: "Khám dinh dưỡng, hô hấp và tăng trưởng định kỳ cho trẻ nhỏ.",
        icon: "🧒",
        color: "from-violet-50 to-fuchsia-50",
        popularityRank: 3,
        coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
    },
];

const DEFAULT_DOCTORS = [
    {
        fullName: "TS.BS Nguyễn Thanh Hùng",
        slug: "dr-nguyen-thanh-hung",
        specialtySlug: "tim-mach",
        title: "Bác sĩ Tim mạch",
        gender: "MALE",
        experienceYears: 14,
        consultationFee: 420000,
        rating: 4.9,
        bookedCount: 328,
        availableSlotsToday: 5,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
        bio: "Chuyên sâu điều trị tăng huyết áp, suy tim và dự phòng biến chứng tim mạch.",
        highlights: ["14 năm kinh nghiệm", "Tư vấn phòng ngừa đột quỵ", "Theo dõi bệnh lý mạn tính"],
        gallery: [
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
        ],
        availabilityDays: [1, 2, 3, 4, 5],
        shifts: ["MORNING", "AFTERNOON"],
        hospital: "CarePlus Clinic",
        isFeatured: true,
        isTopBooked: true,
        isActive: true,
    },
    {
        fullName: "BS Trần Thị Ngọc Lan",
        slug: "dr-tran-thi-ngoc-lan",
        specialtySlug: "co-xuong-khop",
        title: "Bác sĩ Cơ Xương Khớp",
        gender: "FEMALE",
        experienceYears: 11,
        consultationFee: 380000,
        rating: 4.8,
        bookedCount: 287,
        availableSlotsToday: 4,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
        bio: "Điều trị đau vai gáy, thoái hóa cột sống và các bệnh lý khớp mạn tính.",
        highlights: ["Phác đồ phục hồi vận động", "Theo dõi đau lưng mạn tính", "Tư vấn chấn thương thể thao"],
        gallery: [
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
        ],
        availabilityDays: [1, 3, 5, 6],
        shifts: ["MORNING"],
        hospital: "CarePlus Clinic",
        isFeatured: true,
        isTopBooked: true,
        isActive: true,
    },
    {
        fullName: "BS Phạm Thu Hà",
        slug: "dr-pham-thu-ha",
        specialtySlug: "nhi-khoa",
        title: "Bác sĩ Nhi khoa",
        gender: "FEMALE",
        experienceYears: 12,
        consultationFee: 350000,
        rating: 4.9,
        bookedCount: 244,
        availableSlotsToday: 3,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
        bio: "Theo dõi sức khỏe trẻ em, tư vấn dinh dưỡng và điều trị bệnh hô hấp thường gặp.",
        highlights: ["Khám dinh dưỡng trẻ em", "Theo dõi tăng trưởng", "Hỗ trợ bệnh hô hấp"],
        gallery: [
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1200&q=80",
        ],
        availabilityDays: [1, 2, 4, 5],
        shifts: ["MORNING", "AFTERNOON"],
        hospital: "CarePlus Clinic",
        isFeatured: true,
        isTopBooked: true,
        isActive: true,
    },
];

const ensureCatalogSeed = async () => {
    const specialtyCount = await db.Specialty.count();
    if (specialtyCount === 0) {
        await db.Specialty.bulkCreate(DEFAULT_SPECIALTIES);
    }

    const specialties = await db.Specialty.findAll();
    const specialtyIdBySlug = specialties.reduce((acc, item) => {
        acc[item.slug] = item.id;
        return acc;
    }, {});

    const doctorCount = await db.Doctor.count();
    if (doctorCount === 0) {
        await db.Doctor.bulkCreate(
            DEFAULT_DOCTORS.map((doctor) => ({
                ...doctor,
                specialtyId: specialtyIdBySlug[doctor.specialtySlug],
            })),
        );
    }
};

const ensureCatalogSchema = async () => {
    const queryInterface = db.sequelize.getQueryInterface();
    const rawTables = await queryInterface.showAllTables();
    const tables = rawTables.map((entry) => {
        if (typeof entry === "string") return entry.toLowerCase();
        if (entry?.tableName) return String(entry.tableName).toLowerCase();
        return String(entry).toLowerCase();
    });

    const requiredTables = [
        "users",
        "patient_profiles",
        "specialties",
        "doctors",
        "doctor_reviews",
        "favorite_doctors",
        "doctor_view_histories",
        "patient_reward_wallets",
        "patient_vouchers",
        "appointments",
        "relative_profiles",
    ];
    const missingTables = requiredTables.filter((table) => !tables.includes(table));

    if (missingTables.length > 0) {
        await db.sequelize.sync();
    }

    if (missingTables.includes("specialties") || missingTables.includes("doctors")) {
        await ensureCatalogSeed();
    }
};

const connectDB = async () => {
    try {
        await db.sequelize.authenticate();
        const shouldSyncSchema = process.env.DB_SYNC === "true";
        const shouldAlterSchema = process.env.DB_SYNC_ALTER === "true";

        if (shouldSyncSchema) {
            await db.sequelize.sync({ alter: shouldAlterSchema });
            console.log(`Database schema synced (${shouldAlterSchema ? "alter" : "safe sync"} mode).`);
        } else {
            await ensureCatalogSchema();
        }

        console.log("Kết nối database thành công.");
    } catch (error) {
        console.error("Không thể kết nối database:", error);
        throw error;
    }
};

module.exports = connectDB;
