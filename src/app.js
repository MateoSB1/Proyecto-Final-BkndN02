import express from "express"
import { engine } from "express-handlebars"

import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import sessionRouter from "./routes/sessionRouter.js"
import usersRouter from "./routes/usersRouter.js"

import cookieParser from "cookie-parser"

import connectDB from './config/connect.js'

import passport from "passport"
import initializePassport from './config/passportConfig.js'

import session from "express-session"
import MongoStore from "connect-mongo"

import env from './config/envs.js'

const app = express()
const PORT = env.PORT || 3000

const URI = env.MONGO_URI
connectDB(URI, "MateoSB1BkndN02")

app.use(cookieParser())
app.use(passport.initialize())
initializePassport()

const hbs = engine({
    helpers: {
        gt: function (a, b) {
            return a > b
        },
        ifEquals: function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
        }
    },
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: './src/views/layouts/',
})

app.engine('handlebars', hbs)
app.set('view engine', 'handlebars')
app.set('views', './src/views')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("./src/public"))

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: env.MONGO_URI,
            ttl: 60 * 60,
        }),
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000,
        },
    })
);

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/sessions", sessionRouter)
app.use("/api/users", usersRouter)

app.use("/", viewsRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})