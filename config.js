import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
};
