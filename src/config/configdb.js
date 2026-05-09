import db from "../models/index";

const connectDB = async () => {
    try {
        await db.sequelize.authenticate();

        await db.sequelize.sync({ alter: true });
        console.log("Kết nối database thành công.");
    } catch (error) {
        console.error("Không thể kết nối database:", error);
        throw error;
    }
};

module.exports = connectDB;
