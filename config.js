import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
};
