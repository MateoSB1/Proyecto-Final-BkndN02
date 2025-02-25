import dotenv from 'dotenv'

dotenv.config()

export default {
    PORT: process.env.PORT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET
}

