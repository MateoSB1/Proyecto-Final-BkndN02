import { Router } from "express"
import User from "../models/usersModel.js"
import { createHash, isValidPassword } from "../utils.js"
import passport from "passport"
import jwt from "jsonwebtoken"

const router = Router()

router.post("/register", async (req, res) => {
    const { username, password, email, firstName, lastName, role, age } = req.body

    try {
        const existingUser = await User.findOne({ username })

        if (existingUser) {
            return res.status(400).send("El usuario ya existe")
        }

        const newUser = new User({
            username,
            password: createHash(password),
            email,
            first_name: firstName,
            last_name: lastName,
            age,
            role,
            cart: null
        })

        await newUser.save()

        const token = jwt.sign({ username: newUser.username, role: newUser.role }, "extremelydifficulttorevealsecret", { expiresIn: "1h" })

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current")

    } catch (error) {
        console.error("Error al registrar usuario:", error)
        res.status(500).send("Error interno del servidor")
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const foundUser = await User.findOne({ username })

        if (!foundUser) {
            return res.status(401).render("login", { errorMessage: "Nombre de usuario no válido" })
        }

        if (!isValidPassword(password, foundUser)) {
            return res.status(401).render("login", { errorMessage: "Contraseña incorrecta" })
        }

        const token = jwt.sign({ username: foundUser.username, role: foundUser.role }, "extremelydifficulttorevealsecret", { expiresIn: "1h" })

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current")

    } catch (error) {
        console.error("Error en el login:", error)
        res.status(500).render("login", { errorMessage: "Error interno del servidor" })
    }
})

router.post("/recuperate", async (req, res) => {
    const { email, newPassword } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send("Usuario no encontrado")
        }
        user.password = createHash(newPassword)
        await user.save()
        res.redirect("/login")
    } catch (error) {
        console.error("Error al recuperar contraseña:", error)
        res.status(500).send("Error interno del servidor")
    }
})

router.get("/current", passport.authenticate("jwt", { session: false }), async (req, res) => {
    if (req.user) {
        res.redirect("/")
    } else {
        res.status(401).send("No autorizado")
    }
})

router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }))

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/profile",
        failureRedirect: "/login",
    })
)

router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken")
    res.redirect("/login")
})

router.get("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).send("Acceso denegado")
    }
    res.render("admin")
})

export default router