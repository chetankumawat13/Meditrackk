import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT || 3000,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    NODE_ENV: process.env.NODE_ENV || 'development'
};