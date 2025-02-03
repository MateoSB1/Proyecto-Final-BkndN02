import { Router } from "express"
import { extractUserFromToken } from "../utils.js"

const router = Router()

router.use(extractUserFromToken)

router.get("/", (req, res) => {
    res.render("home")
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/recuperate", (req, res) => {
    res.render("recuperate", { title: "Recuperar Contraseña" })
})

router.get("/admin", (req, res) => {
    if (res.locals.role === 'admin') {
        res.render('admin')
    } else {
        res.status(403).send('Unauthorized')
    }
})

export default router