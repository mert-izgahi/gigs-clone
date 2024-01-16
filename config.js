import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    MAIL_TRAP_HOST: process.env.MAIL_TRAP_HOST,
    MAIL_TRAP_PORT: process.env.MAIL_TRAP_PORT,
    MAIL_TRAP_USER: process.env.MAIL_TRAP_USER,
    MAIL_TRAP_PASS: process.env.MAIL_TRAP_PASS,
};
