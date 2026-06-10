const CLINIC_INFO = {
    name: "CarePlus Clinic",
    phone: "1900 1234",
    email: "lienhe@careplus.vn",
    address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
    workingHours: [
        "Thứ 2 – Thứ 6: 7:30 – 17:00",
        "Thứ 7: 7:30 – 12:00",
        "Chủ nhật: Nghỉ",
    ],
};

let specialties = [
    {
        id: 1,
        slug: "co-xuong-khop",
        name: "Cơ Xương Khớp",
        summary: "Chẩn đoán và điều trị các bệnh lý xương khớp, cột sống và vận động.",
        description: "Chuyên khoa hỗ trợ khám đau lưng, thoái hóa khớp, chấn thương thể thao và phục hồi chức năng vận động.",
        icon: "🦴",
        color: "from-rose-50 to-orange-50",
        doctorCount: 3,
        popularityRank: 1,
        isActive: true,
        coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 2,
        slug: "tim-mach",
        name: "Tim mạch",
        summary: "Khám và theo dõi các bệnh tim mạch, huyết áp, mỡ máu.",
        description: "Tập trung kiểm tra sức khỏe tim mạch, nguy cơ đột quỵ, rối loạn nhịp tim và tư vấn dự phòng lâu dài.",
        icon: "❤️",
        color: "from-sky-50 to-cyan-50",
        doctorCount: 2,
        popularityRank: 2,
        isActive: true,
        coverImage: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 3,
        slug: "tai-mui-hong",
        name: "Tai Mũi Họng",
        summary: "Khám viêm xoang, viêm họng, ù tai, các bệnh lý đường hô hấp trên.",
        description: "Hỗ trợ điều trị viêm amidan, viêm xoang, rối loạn thính lực và các vấn đề tai mũi họng thường gặp.",
        icon: "👂",
        color: "from-emerald-50 to-teal-50",
        doctorCount: 2,
        popularityRank: 3,
        isActive: true,
        coverImage: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 4,
        slug: "nhi-khoa",
        name: "Nhi khoa",
        summary: "Theo dõi sức khỏe, dinh dưỡng và điều trị các bệnh lý thường gặp ở trẻ.",
        description: "Đánh giá tăng trưởng, dinh dưỡng, sức đề kháng và điều trị các bệnh lý hô hấp, tiêu hóa ở trẻ em.",
        icon: "🧒",
        color: "from-violet-50 to-fuchsia-50",
        doctorCount: 2,
        popularityRank: 4,
        isActive: true,
        coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 5,
        slug: "da-lieu",
        name: "Da liễu",
        summary: "Điều trị mụn, viêm da, nám da, rụng tóc và chăm sóc da chuyên sâu.",
        description: "Khám và điều trị các vấn đề da liễu thường gặp, tư vấn phác đồ chăm sóc da phù hợp từng tình trạng.",
        icon: "✨",
        color: "from-amber-50 to-yellow-50",
        doctorCount: 2,
        popularityRank: 5,
        isActive: true,
        coverImage: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 6,
        slug: "tieu-hoa",
        name: "Tiêu hóa",
        summary: "Khám đau dạ dày, đại tràng, trào ngược và các bệnh lý đường tiêu hóa.",
        description: "Tư vấn, nội soi, theo dõi bệnh lý dạ dày, đại tràng, gan mật và điều chỉnh chế độ ăn hỗ trợ điều trị.",
        icon: "🌿",
        color: "from-lime-50 to-emerald-50",
        doctorCount: 2,
        popularityRank: 6,
        isActive: true,
        coverImage: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 7,
        slug: "san-phu-khoa",
        name: "Sản Phụ khoa",
        summary: "Theo dõi sức khỏe phụ khoa, thai sản và tư vấn chăm sóc toàn diện.",
        description: "Khám phụ khoa định kỳ, tư vấn sức khỏe sinh sản, thai kỳ và kế hoạch chăm sóc trước sau sinh.",
        icon: "💗",
        color: "from-pink-50 to-rose-50",
        doctorCount: 2,
        popularityRank: 7,
        isActive: true,
        coverImage: "https://images.unsplash.com/photo-1516549655669-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 8,
        slug: "noi-tong-quat",
        name: "Nội tổng quát",
        summary: "Khám tổng quát, tầm soát bệnh lý mạn tính và chăm sóc sức khỏe định kỳ.",
        description: "Đánh giá toàn diện tình trạng sức khỏe, tầm soát sớm bệnh lý và lập kế hoạch theo dõi cá nhân hóa.",
        icon: "🩺",
        color: "from-slate-50 to-blue-50",
        doctorCount: 4,
        popularityRank: 8,
        isActive: true,
        coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    },
];

let doctors = [
    {
        id: 101,
        slug: "dr-nguyen-thanh-hung",
        specialtyId: 2,
        fullName: "TS.BS Nguyễn Thanh Hùng",
        title: "Bác sĩ Tim mạch",
        gender: "MALE",
        experienceYears: 14,
        consultationFee: 420000,
        bookedCount: 328,
        availableSlotsToday: 5,
        rating: 4.9,
        bio: "Chuyên sâu điều trị tăng huyết áp, suy tim và dự phòng biến chứng tim mạch.",
        hospital: "CarePlus Clinic",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: ["14 năm kinh nghiệm", "Tư vấn phòng ngừa đột quỵ", "Theo dõi bệnh lý mạn tính"],
        availabilityDays: [1, 2, 3, 4, 5],
        shifts: ["MORNING", "AFTERNOON"],
        isFeatured: true,
        isTopBooked: true,
        isActive: true,
    },
    {
        id: 102,
        slug: "dr-tran-thi-ngoc-lan",
        specialtyId: 1,
        fullName: "BS Trần Thị Ngọc Lan",
        title: "Bác sĩ Cơ Xương Khớp",
        gender: "FEMALE",
        experienceYears: 11,
        consultationFee: 380000,
        bookedCount: 287,
        availableSlotsToday: 4,
        rating: 4.8,
        bio: "Điều trị đau vai gáy, thoái hóa cột sống và các bệnh lý khớp mạn tính.",
        hospital: "CarePlus Clinic",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: ["Phác đồ phục hồi vận động", "Theo dõi đau lưng mạn tính", "Tư vấn chấn thương thể thao"],
        availabilityDays: [1, 3, 5, 6],
        shifts: ["MORNING"],
        isFeatured: true,
        isTopBooked: true,
        isActive: true,
    },
    {
        id: 103,
        slug: "dr-le-minh-quan",
        specialtyId: 3,
        fullName: "BS Lê Minh Quân",
        title: "Bác sĩ Tai Mũi Họng",
        gender: "MALE",
        experienceYears: 9,
        consultationFee: 320000,
        bookedCount: 190,
        availableSlotsToday: 6,
        rating: 4.7,
        bio: "Điều trị viêm xoang, viêm họng kéo dài và rối loạn giọng nói.",
        hospital: "CarePlus Clinic",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1511174511562-5f97f4f4a54a?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: ["Nội soi tai mũi họng", "Tư vấn viêm xoang mạn", "Điều trị ù tai"],
        availabilityDays: [2, 4, 6],
        shifts: ["AFTERNOON"],
        isFeatured: false,
        isTopBooked: false,
        isActive: true,
    },
    {
        id: 104,
        slug: "dr-pham-thu-ha",
        specialtyId: 4,
        fullName: "BS Phạm Thu Hà",
        title: "Bác sĩ Nhi khoa",
        gender: "FEMALE",
        experienceYears: 12,
        consultationFee: 350000,
        bookedCount: 244,
        availableSlotsToday: 3,
        rating: 4.9,
        bio: "Theo dõi sức khỏe trẻ em, tư vấn dinh dưỡng và điều trị bệnh hô hấp thường gặp.",
        hospital: "CarePlus Clinic",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: ["Khám dinh dưỡng trẻ em", "Theo dõi tăng trưởng", "Hỗ trợ bệnh hô hấp"],
        availabilityDays: [1, 2, 4, 5],
        shifts: ["MORNING", "AFTERNOON"],
        isFeatured: true,
        isTopBooked: true,
        isActive: true,
    },
    {
        id: 105,
        slug: "dr-vo-hoang-yen",
        specialtyId: 5,
        fullName: "BS Võ Hoàng Yến",
        title: "Bác sĩ Da liễu",
        gender: "FEMALE",
        experienceYears: 8,
        consultationFee: 360000,
        bookedCount: 156,
        availableSlotsToday: 7,
        rating: 4.6,
        bio: "Chuyên trị mụn, viêm da cơ địa, nám da và chăm sóc da chuyên sâu.",
        hospital: "CarePlus Clinic",
        image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=900&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: ["Điều trị mụn cá nhân hóa", "Chăm sóc da nhạy cảm", "Tư vấn nám da"],
        availabilityDays: [1, 3, 5],
        shifts: ["AFTERNOON"],
        isFeatured: false,
        isTopBooked: false,
        isActive: true,
    },
    {
        id: 106,
        slug: "dr-do-quoc-bao",
        specialtyId: 6,
        fullName: "BS Đỗ Quốc Bảo",
        title: "Bác sĩ Tiêu hóa",
        gender: "MALE",
        experienceYears: 10,
        consultationFee: 390000,
        bookedCount: 210,
        availableSlotsToday: 4,
        rating: 4.8,
        bio: "Theo dõi bệnh dạ dày, đại tràng, gan mật và tư vấn chế độ ăn hỗ trợ điều trị.",
        hospital: "CarePlus Clinic",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1631815588090-d1bcbe9a0a5c?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: ["Theo dõi dạ dày mạn tính", "Tư vấn đại tràng kích thích", "Điều chỉnh chế độ ăn"],
        availabilityDays: [2, 3, 5, 6],
        shifts: ["MORNING"],
        isFeatured: false,
        isTopBooked: true,
        isActive: true,
    },
];

const articles = [
    {
        id: 201,
        slug: "phong-ngua-benh-tim-mach-hieu-qua-tai-nha",
        category: "Tim mạch",
        title: "Phòng ngừa bệnh tim mạch hiệu quả tại nhà",
        summary: "Những biện pháp đơn giản giúp bảo vệ trái tim khỏe mạnh mỗi ngày.",
        publishedAt: "2026-05-21",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Bệnh tim mạch là một trong những nguyên nhân hàng đầu gây ảnh hưởng đến chất lượng sống. Việc xây dựng thói quen sinh hoạt lành mạnh có thể giúp bạn giảm đáng kể nguy cơ mắc bệnh.",
            "Hãy ưu tiên chế độ ăn ít muối, tăng rau xanh, ngủ đủ giấc và duy trì vận động ít nhất 30 phút mỗi ngày. Đồng thời, nên kiểm tra huyết áp và mỡ máu định kỳ nếu bạn thuộc nhóm nguy cơ.",
            "Nếu xuất hiện các dấu hiệu như đau ngực, khó thở, hồi hộp kéo dài hoặc tăng huyết áp không kiểm soát, bạn nên đặt lịch khám sớm với bác sĩ tim mạch để được đánh giá chuyên sâu.",
        ],
        relatedIds: [202, 203, 204],
        isLatest: true,
    },
    {
        id: 202,
        slug: "che-do-an-uong-tot-cho-nguoi-benh-tieu-hoa",
        category: "Tiêu hóa",
        title: "Chế độ ăn uống tốt cho người bệnh tiêu hóa",
        summary: "Gợi ý thực đơn và lưu ý sinh hoạt giúp hệ tiêu hóa phục hồi tốt hơn.",
        publishedAt: "2026-05-16",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Người có vấn đề tiêu hóa nên ưu tiên các bữa ăn nhỏ, dễ tiêu, hạn chế đồ cay nóng và thức uống có gas.",
            "Việc theo dõi phản ứng của cơ thể với từng nhóm thực phẩm sẽ giúp bạn điều chỉnh thực đơn phù hợp, đặc biệt khi có trào ngược hoặc hội chứng ruột kích thích.",
            "Khám bác sĩ sớm nếu bạn đau bụng kéo dài, sụt cân không rõ nguyên nhân hoặc rối loạn tiêu hóa tái diễn nhiều lần.",
        ],
        relatedIds: [201, 203, 204],
        isLatest: true,
    },
    {
        id: 203,
        slug: "cach-cham-soc-da-dung-cach-trong-mua-he",
        category: "Da liễu",
        title: "Cách chăm sóc da đúng cách trong mùa hè",
        summary: "Bảo vệ da trước nắng nóng, dầu thừa và kích ứng trong thời tiết oi bức.",
        publishedAt: "2026-05-11",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Mùa hè khiến da dễ tăng tiết dầu, kích ứng và sạm màu nếu không được bảo vệ đúng cách.",
            "Bạn nên ưu tiên kem chống nắng phổ rộng, làm sạch nhẹ nhàng và tránh lạm dụng hoạt chất mạnh khi da đang nhạy cảm.",
            "Nếu da nổi mụn kéo dài, đỏ rát hoặc bong tróc bất thường, hãy gặp bác sĩ da liễu để được tư vấn phác đồ phù hợp.",
        ],
        relatedIds: [201, 202, 204],
        isLatest: true,
    },
    {
        id: 204,
        slug: "dinh-duong-cho-tre-em-trong-giai-doan-phat-trien",
        category: "Nhi khoa",
        title: "Dinh dưỡng cho trẻ em trong giai đoạn phát triển",
        summary: "Những nguyên tắc nền tảng giúp trẻ phát triển chiều cao và đề kháng tốt hơn.",
        publishedAt: "2026-05-06",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Trẻ em cần được cung cấp đủ đạm, chất béo tốt, vitamin và khoáng chất theo từng giai đoạn phát triển.",
            "Phụ huynh nên theo dõi cân nặng, chiều cao định kỳ và chú ý đến giấc ngủ, mức độ vận động, thói quen ăn uống của trẻ.",
            "Khi trẻ biếng ăn kéo dài, chậm tăng trưởng hoặc thường xuyên mắc bệnh, nên khám bác sĩ nhi để được đánh giá toàn diện.",
        ],
        relatedIds: [201, 202, 203],
        isLatest: false,
    },
];

const ADMIN_PAGE_SIZE = 20;

const slugify = (value = "") => {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const nextId = (items, fallback) => {
    return items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : fallback;
};

const formatCompactMoney = (amount) => {
    const numeric = Number(amount) || 0;
    if (!numeric) return "0K";
    return `${Math.round(numeric / 1000)}K`;
};

const getSpecialtyById = (specialtyId) => specialties.find((item) => item.id === specialtyId);

const syncSpecialtyDoctorCounts = () => {
    specialties = specialties.map((specialty) => ({
        ...specialty,
        doctorCount: doctors.filter((doctor) => doctor.specialtyId === specialty.id).length,
    }));
};

const enrichDoctor = (doctor) => {
    const specialty = getSpecialtyById(doctor.specialtyId);
    return {
        ...doctor,
        specialty,
        specialtyName: specialty?.name || "Chưa phân loại",
        consultationFeeLabel: formatCompactMoney(doctor.consultationFee),
        ratingLabel: `⭐ ${doctor.rating || 0} (${doctor.bookedCount || 0})`,
    };
};

const sortByQuery = (items, sort) => {
    const list = [...items];

    switch (sort) {
        case "fee_asc":
            return list.sort((a, b) => (a.consultationFee || 0) - (b.consultationFee || 0));
        case "fee_desc":
            return list.sort((a, b) => (b.consultationFee || 0) - (a.consultationFee || 0));
        case "booked_desc":
            return list.sort((a, b) => (b.bookedCount || 0) - (a.bookedCount || 0));
        case "rating_desc":
            return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case "name_asc":
            return list.sort((a, b) => (a.name || a.fullName).localeCompare(b.name || b.fullName, "vi"));
        case "latest":
            return list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
        default:
            return list;
    }
};

const buildSlotsForDoctor = (doctor, dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return [];
    }

    const day = date.getDay();
    if (!doctor.availabilityDays.includes(day)) {
        return [];
    }

    const shiftSlots = {
        MORNING: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"],
        AFTERNOON: ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
    };

    const slots = doctor.shifts.flatMap((shift) => shiftSlots[shift] || []);
    const limited = slots.slice(0, Math.max(doctor.availableSlotsToday, 1));

    return limited.map((startTime) => {
        const [hour, minute] = startTime.split(":").map(Number);
        const end = new Date(date);
        end.setHours(hour, minute + 30, 0, 0);
        return {
            startTime,
            endTime: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
            available: true,
        };
    });
};

const resolveBySlugOrId = (items, slugOrId) => {
    return items.find((item) => String(item.id) === String(slugOrId) || item.slug === slugOrId);
};

const ensureSpecialtyExists = (specialtyId) => {
    const specialty = getSpecialtyById(Number(specialtyId));
    if (!specialty) {
        const error = new Error("Chuyên khoa không tồn tại");
        error.status = 400;
        throw error;
    }
    return specialty;
};

const ensureUniqueSpecialty = ({ name, slug }, excludeId) => {
    const normalizedSlug = slugify(slug || name);
    const duplicated = specialties.find((item) => {
        if (excludeId && Number(item.id) === Number(excludeId)) return false;
        return item.slug === normalizedSlug || item.name.toLowerCase() === String(name).trim().toLowerCase();
    });

    if (duplicated) {
        const error = new Error("Tên hoặc slug chuyên khoa đã tồn tại");
        error.status = 409;
        throw error;
    }

    return normalizedSlug;
};

const ensureUniqueDoctor = ({ fullName, slug }, excludeId) => {
    const normalizedSlug = slugify(slug || fullName);
    const duplicated = doctors.find((item) => {
        if (excludeId && Number(item.id) === Number(excludeId)) return false;
        return item.slug === normalizedSlug || item.fullName.toLowerCase() === String(fullName).trim().toLowerCase();
    });

    if (duplicated) {
        const error = new Error("Tên hoặc slug bác sĩ đã tồn tại");
        error.status = 409;
        throw error;
    }

    return normalizedSlug;
};

const sanitizeSpecialtyPayload = (payload = {}, existing = {}) => {
    const name = String(payload.name || existing.name || "").trim();
    if (!name) {
        const error = new Error("Tên chuyên khoa là bắt buộc");
        error.status = 400;
        throw error;
    }

    return {
        ...existing,
        name,
        slug: ensureUniqueSpecialty({ name, slug: payload.slug }, existing.id),
        summary: String(payload.summary || existing.summary || "").trim(),
        description: String(payload.description || existing.description || "").trim(),
        icon: String(payload.icon || existing.icon || "🩺").trim(),
        color: String(payload.color || existing.color || "from-sky-50 to-cyan-50").trim(),
        popularityRank: Number(payload.popularityRank ?? existing.popularityRank ?? specialties.length + 1),
        isActive: payload.isActive === undefined ? Boolean(existing.isActive ?? true) : String(payload.isActive) !== "false",
        coverImage: String(payload.coverImage || existing.coverImage || "").trim(),
    };
};

const sanitizeDoctorPayload = (payload = {}, existing = {}) => {
    const fullName = String(payload.fullName || existing.fullName || "").trim();
    if (!fullName) {
        const error = new Error("Tên bác sĩ là bắt buộc");
        error.status = 400;
        throw error;
    }

    const specialtyId = Number(payload.specialtyId ?? existing.specialtyId);
    ensureSpecialtyExists(specialtyId);

    const parsedFee = Number(payload.consultationFee ?? existing.consultationFee ?? 0);
    const parsedExperience = Number(payload.experienceYears ?? existing.experienceYears ?? 0);
    const parsedRating = Number(payload.rating ?? existing.rating ?? 0);
    const parsedBooked = Number(payload.bookedCount ?? existing.bookedCount ?? 0);
    const parsedSlots = Number(payload.availableSlotsToday ?? existing.availableSlotsToday ?? 0);

    return {
        ...existing,
        fullName,
        slug: ensureUniqueDoctor({ fullName, slug: payload.slug }, existing.id),
        title: String(payload.title || existing.title || "").trim(),
        specialtyId,
        gender: String(payload.gender || existing.gender || "OTHER").toUpperCase(),
        experienceYears: Number.isNaN(parsedExperience) ? 0 : parsedExperience,
        consultationFee: Number.isNaN(parsedFee) ? 0 : parsedFee,
        bookedCount: Number.isNaN(parsedBooked) ? 0 : parsedBooked,
        availableSlotsToday: Number.isNaN(parsedSlots) ? 0 : parsedSlots,
        rating: Number.isNaN(parsedRating) ? 0 : parsedRating,
        bio: String(payload.bio || existing.bio || "").trim(),
        hospital: String(payload.hospital || existing.hospital || CLINIC_INFO.name).trim(),
        image: String(payload.image || existing.image || "").trim(),
        gallery: Array.isArray(payload.gallery)
            ? payload.gallery.filter(Boolean)
            : String(payload.gallery || "")
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 6),
        highlights: Array.isArray(payload.highlights)
            ? payload.highlights.filter(Boolean)
            : String(payload.highlights || "")
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 6),
        availabilityDays: Array.isArray(payload.availabilityDays)
            ? payload.availabilityDays.map((item) => Number(item)).filter((item) => !Number.isNaN(item))
            : existing.availabilityDays || [1, 2, 3, 4, 5],
        shifts: Array.isArray(payload.shifts)
            ? payload.shifts.map((item) => String(item).toUpperCase()).filter(Boolean)
            : existing.shifts || ["MORNING"],
        isFeatured: payload.isFeatured === undefined ? Boolean(existing.isFeatured ?? false) : String(payload.isFeatured) === "true",
        isTopBooked: payload.isTopBooked === undefined ? Boolean(existing.isTopBooked ?? false) : String(payload.isTopBooked) === "true",
        isActive: payload.isActive === undefined ? Boolean(existing.isActive ?? true) : String(payload.isActive) !== "false",
    };
};

const listSpecialties = (query = {}) => {
    const keyword = (query.search || "").trim().toLowerCase();
    let results = [...specialties].filter((item) => item.isActive !== false);

    if (keyword) {
        results = results.filter((item) =>
            `${item.name} ${item.summary} ${item.description}`.toLowerCase().includes(keyword)
        );
    }

    if (query.sort === "popular") {
        results.sort((a, b) => a.popularityRank - b.popularityRank);
    } else {
        results.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }

    return {
        items: results.map((item) => ({
            ...item,
            doctors: doctors.filter((doctor) => doctor.specialtyId === item.id && doctor.isActive !== false).length,
        })),
        total: results.length,
    };
};

const getSpecialtyDetail = (slugOrId) => {
    const specialty = resolveBySlugOrId(specialties, slugOrId);
    if (!specialty || specialty.isActive === false) {
        return null;
    }

    const specialtyDoctors = doctors
        .filter((doctor) => doctor.specialtyId === specialty.id && doctor.isActive !== false)
        .map(enrichDoctor);
    return {
        ...specialty,
        doctors: specialtyDoctors,
    };
};

const listDoctors = (query = {}) => {
    const keyword = (query.search || "").trim().toLowerCase();
    let results = doctors.filter((doctor) => doctor.isActive !== false).map(enrichDoctor);

    if (keyword) {
        results = results.filter((doctor) =>
            `${doctor.fullName} ${doctor.title} ${doctor.bio} ${doctor.specialty?.name || ""}`.toLowerCase().includes(keyword)
        );
    }

    if (query.specialty) {
        results = results.filter((doctor) =>
            String(doctor.specialtyId) === String(query.specialty) || doctor.specialty?.slug === query.specialty
        );
    }

    if (query.gender) {
        results = results.filter((doctor) => doctor.gender === String(query.gender).toUpperCase());
    }

    if (query.minFee) {
        results = results.filter((doctor) => doctor.consultationFee >= Number(query.minFee));
    }

    if (query.maxFee) {
        results = results.filter((doctor) => doctor.consultationFee <= Number(query.maxFee));
    }

    if (query.minExperience) {
        results = results.filter((doctor) => doctor.experienceYears >= Number(query.minExperience));
    }

    if (query.availableOnly === "true") {
        results = results.filter((doctor) => doctor.availableSlotsToday > 0);
    }

    if (query.date) {
        results = results.filter((doctor) => buildSlotsForDoctor(doctor, query.date).length > 0);
    }

    results = sortByQuery(results, query.sort || "booked_desc");

    return {
        items: results,
        total: results.length,
    };
};

const getDoctorDetail = (slugOrId) => {
    const doctor = resolveBySlugOrId(doctors, slugOrId);
    if (!doctor || doctor.isActive === false) {
        return null;
    }

    const enriched = enrichDoctor(doctor);
    const relatedDoctors = doctors
        .filter((item) => item.specialtyId === doctor.specialtyId && item.id !== doctor.id && item.isActive !== false)
        .slice(0, 3)
        .map(enrichDoctor);

    const nextThreeDays = Array.from({ length: 3 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        const dateString = date.toISOString().slice(0, 10);
        return {
            date: dateString,
            slots: buildSlotsForDoctor(doctor, dateString),
        };
    });

    return {
        ...enriched,
        relatedDoctors,
        schedules: nextThreeDays,
    };
};

const listArticles = (query = {}) => {
    const keyword = (query.search || "").trim().toLowerCase();
    let results = [...articles];

    if (keyword) {
        results = results.filter((item) =>
            `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(keyword)
        );
    }

    if (query.category) {
        results = results.filter((item) => item.category.toLowerCase() === String(query.category).toLowerCase());
    }

    results = sortByQuery(results, query.sort || "latest");

    return {
        items: results,
        total: results.length,
        categories: [...new Set(articles.map((item) => item.category))],
    };
};

const getArticleDetail = (slugOrId) => {
    const article = resolveBySlugOrId(articles, slugOrId);
    if (!article) {
        return null;
    }

    return {
        ...article,
        relatedArticles: articles.filter((item) => article.relatedIds.includes(item.id)),
    };
};

const getAvailableSlots = (slugOrId, date) => {
    const doctor = resolveBySlugOrId(doctors, slugOrId);
    if (!doctor || doctor.isActive === false) {
        return null;
    }

    return buildSlotsForDoctor(doctor, date);
};

const getHomeData = () => {
    syncSpecialtyDoctorCounts();

    const featuredDoctors = doctors.filter((doctor) => doctor.isFeatured && doctor.isActive !== false).slice(0, 4).map(enrichDoctor);
    const topBookedDoctors = sortByQuery(doctors.filter((doctor) => doctor.isActive !== false).map(enrichDoctor), "booked_desc").slice(0, 4);
    const featuredSpecialties = specialties.filter((specialty) => specialty.isActive !== false).slice(0, 8).map((specialty) => ({
        ...specialty,
        doctors: doctors.filter((doctor) => doctor.specialtyId === specialty.id && doctor.isActive !== false).length,
    }));
    const latestArticles = sortByQuery(articles, "latest").slice(0, 4);

    return {
        clinicInfo: CLINIC_INFO,
        stats: {
            specialties: specialties.filter((item) => item.isActive !== false).length,
            doctors: doctors.filter((item) => item.isActive !== false).length,
            trustedPatients: 1000,
            averageRating: 4.8,
        },
        featuredSpecialties,
        featuredDoctors,
        topBookedDoctors,
        latestArticles,
    };
};

const getAdminDashboardData = () => {
    syncSpecialtyDoctorCounts();

    const activeDoctors = doctors.filter((item) => item.isActive !== false);
    const totalBookings = doctors.reduce((total, item) => total + (item.bookedCount || 0), 0);
    const averageFee = activeDoctors.length
        ? Math.round(activeDoctors.reduce((total, item) => total + (item.consultationFee || 0), 0) / activeDoctors.length)
        : 0;
    const averageRating = activeDoctors.length
        ? Number((activeDoctors.reduce((total, item) => total + (item.rating || 0), 0) / activeDoctors.length).toFixed(1))
        : 0;

    return {
        stats: [
            {
                key: "specialties",
                title: "Chuyên khoa đang hoạt động",
                value: specialties.filter((item) => item.isActive !== false).length,
                description: "Nhóm dịch vụ đang mở cho bệnh nhân đặt lịch.",
            },
            {
                key: "doctors",
                title: "Bác sĩ đang hoạt động",
                value: activeDoctors.length,
                description: "Đang hiển thị ở trang công khai và có thể được đặt lịch.",
            },
            {
                key: "bookings",
                title: "Tổng lượt đặt lịch mẫu",
                value: totalBookings,
                description: "Dùng để minh họa dữ liệu quản trị hiện tại.",
            },
            {
                key: "rating",
                title: "Điểm đánh giá trung bình",
                value: averageRating,
                description: "Tính trên toàn bộ bác sĩ đang hoạt động.",
            },
        ],
        highlights: {
            averageFee,
            pendingDoctorProfiles: doctors.filter((item) => !item.isActive).length,
            featuredDoctors: activeDoctors.filter((item) => item.isFeatured).length,
            topSpecialties: specialties
                .map((item) => ({
                    id: item.id,
                    name: item.name,
                    doctorCount: doctors.filter((doctor) => doctor.specialtyId === item.id && doctor.isActive !== false).length,
                }))
                .sort((a, b) => b.doctorCount - a.doctorCount)
                .slice(0, 4),
        },
        recentDoctors: sortByQuery(activeDoctors.map(enrichDoctor), "booked_desc").slice(0, 5),
    };
};

const listAdminSpecialties = (query = {}) => {
    syncSpecialtyDoctorCounts();
    const keyword = String(query.search || "").trim().toLowerCase();
    let items = specialties.map((item) => ({
        ...item,
        doctorCount: doctors.filter((doctor) => doctor.specialtyId === item.id).length,
    }));

    if (keyword) {
        items = items.filter((item) =>
            `${item.name} ${item.summary} ${item.description}`.toLowerCase().includes(keyword)
        );
    }

    if (query.status === "active") {
        items = items.filter((item) => item.isActive !== false);
    }

    if (query.status === "inactive") {
        items = items.filter((item) => item.isActive === false);
    }

    items = sortByQuery(items, query.sort || "name_asc");

    return {
        items,
        total: items.length,
        pageSize: ADMIN_PAGE_SIZE,
    };
};

const createSpecialty = (payload = {}) => {
    const specialty = sanitizeSpecialtyPayload(payload);
    const record = {
        id: nextId(specialties, 1),
        ...specialty,
    };
    specialties = [record, ...specialties];
    syncSpecialtyDoctorCounts();
    return record;
};

const updateSpecialty = (id, payload = {}) => {
    const current = specialties.find((item) => Number(item.id) === Number(id));
    if (!current) {
        return null;
    }

    const updated = sanitizeSpecialtyPayload(payload, current);
    specialties = specialties.map((item) => (Number(item.id) === Number(id) ? { ...current, ...updated } : item));
    syncSpecialtyDoctorCounts();
    return specialties.find((item) => Number(item.id) === Number(id));
};

const deleteSpecialty = (id) => {
    const current = specialties.find((item) => Number(item.id) === Number(id));
    if (!current) {
        return false;
    }

    const hasDoctors = doctors.some((doctor) => Number(doctor.specialtyId) === Number(id));
    if (hasDoctors) {
        const error = new Error("Không thể xóa chuyên khoa đang có bác sĩ liên kết");
        error.status = 409;
        throw error;
    }

    specialties = specialties.filter((item) => Number(item.id) !== Number(id));
    return true;
};

const listAdminDoctors = (query = {}) => {
    const keyword = String(query.search || "").trim().toLowerCase();
    let items = doctors.map(enrichDoctor);

    if (keyword) {
        items = items.filter((item) =>
            `${item.fullName} ${item.title} ${item.specialtyName} ${item.bio}`.toLowerCase().includes(keyword)
        );
    }

    if (query.specialtyId) {
        items = items.filter((item) => String(item.specialtyId) === String(query.specialtyId));
    }

    if (query.status === "active") {
        items = items.filter((item) => item.isActive !== false);
    }

    if (query.status === "inactive") {
        items = items.filter((item) => item.isActive === false);
    }

    items = sortByQuery(items, query.sort || "booked_desc");

    return {
        items,
        total: items.length,
        pageSize: ADMIN_PAGE_SIZE,
    };
};

const createDoctor = (payload = {}) => {
    const doctor = sanitizeDoctorPayload(payload);
    const record = {
        id: nextId(doctors, 100),
        ...doctor,
    };
    doctors = [record, ...doctors];
    syncSpecialtyDoctorCounts();
    return enrichDoctor(record);
};

const updateDoctor = (id, payload = {}) => {
    const current = doctors.find((item) => Number(item.id) === Number(id));
    if (!current) {
        return null;
    }

    const updated = sanitizeDoctorPayload(payload, current);
    doctors = doctors.map((item) => (Number(item.id) === Number(id) ? { ...current, ...updated } : item));
    syncSpecialtyDoctorCounts();
    return enrichDoctor(doctors.find((item) => Number(item.id) === Number(id)));
};

const deleteDoctor = (id) => {
    const exists = doctors.some((item) => Number(item.id) === Number(id));
    if (!exists) {
        return false;
    }

    doctors = doctors.filter((item) => Number(item.id) !== Number(id));
    syncSpecialtyDoctorCounts();
    return true;
};

module.exports = {
    getHomeData,
    listSpecialties,
    getSpecialtyDetail,
    listDoctors,
    getDoctorDetail,
    getAvailableSlots,
    listArticles,
    getArticleDetail,
    getAdminDashboardData,
    listAdminSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    listAdminDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
};
