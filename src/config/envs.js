import dotenv from 'dotenv'

dotenv.config()

export default {
    PORT: process.env.PORT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    RESET_TOKEN_EXPIRATION: process.env.RESET_TOKEN_EXPIRATION
}

