import express from "express"
import { engine } from "express-handlebars"

import viewsRouter from "./routes/viewsRouter.js"
import sessionRouter from "./routes/sessionRouter.js"
import usersRouter from "./routes/usersRouter.js"

import cookieParser from "cookie-parser"

import connectDB from './config/database.js'

import passport from "passport"
import initializePassport from './config/passportConfig.js'

import session from "express-session"
import MongoStore from "connect-mongo"

import dotenv from "dotenv"

dotenv.config()

const app = express()
app.set("PORT", 3000)

const URI = process.env.MONGO_URI
connectDB(URI)

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("./src/public"))
app.use(cookieParser())

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: URI,
            ttl: 100,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

app.use(passport.initialize())
app.use(passport.session())
initializePassport()

app.use("/api/sessions", sessionRouter)
app.use("/api/users", usersRouter)
app.use("/", viewsRouter)

app.listen(app.get("PORT"), () => {
    console.log(`Server on port http://localhost:${app.get("PORT")}`)
})