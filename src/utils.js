import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

const extractUserFromToken = (req, res, next) => {
    const token = req.cookies.coderCookieToken
    if (token) {
        try {
            const decoded = jwt.verify(token, "extremelydifficulttorevealsecret")
            res.locals.username = decoded.username
            res.locals.role = decoded.role
        } catch (error) {
            console.error("Error al decodificar el token:", error)
        }
    }
    next()
}

export { createHash, isValidPassword, extractUserFromToken }