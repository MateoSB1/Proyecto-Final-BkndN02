import UserService from '../services/usersService.js'
import UserDTO from '../dto/userDTO.js'
import jwt from 'jsonwebtoken'
import env from '../config/envs.js'

class UsersController {
    async createUser(req, res) {
        try {
            const { first_name, last_name, email, age, username, role } = req.body

            const userDTO = new UserDTO(first_name, last_name, email, age, username, role)

            const newUser = await UserService.createUser(userDTO)
            res.status(201).json(newUser)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await UserService.getUsers()
            res.json(users)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id)
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
            res.json(user)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    async updateUser(req, res) {
        try {
            const userDTO = req.body
            const updatedUser = await UserService.updateUser(req.params.id, userDTO)
            if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' })
            res.json(updatedUser)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    async deleteUser(req, res) {
        try {
            const deletedUser = await UserService.deleteUser(req.params.id)
            if (!deletedUser) return res.status(404).json({ error: 'Usuario no encontrado' })
            res.json({ message: 'Usuario eliminado' })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    async getCartByUserId(req, res) {
        try {
            const cart = await UserService.getCartByUserId(req.params.id)
            if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })
            res.json(cart)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

    async register(req, res) {
        try {
            const { firstName, lastName, email, age, username, password, role } = req.body
    
            if (!firstName || !lastName) {
                return res.status(400).send("Los campos first_name y last_name son requeridos")
            }
    
            const userDTO = new UserDTO(firstName, lastName, email, age, username, role)
            const newUser = await UserService.registerUser({ ...userDTO, password })
    
            const token = jwt.sign(
                { username: newUser.username, email: newUser.email, role: newUser.role },
                "extremelydifficulttorevealsecret",
                { expiresIn: "1h" }
            )
    
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true,
            })
    
            res.redirect("/api/sessions/current")
        } catch (error) {
            console.error("Error al registrar usuario:", error)
            if (error.message.includes("correo electrónico")) {
                return res.status(400).send("El correo electrónico ya está registrado")
            }
            if (error.message.includes("nombre de usuario")) {
                return res.status(400).send("El nombre de usuario ya está registrado")
            }
            res.status(500).send("Error interno del servidor")
        }
    }

    async login(req, res) {

        const { username, password } = req.body

        try {
            const user = await UserService.loginUser(username, password)

            const token = jwt.sign({ username: user.username, role: user.role }, "extremelydifficulttorevealsecret", { expiresIn: "1h" })

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            })

            res.redirect("/api/sessions/current")

        } catch (error) {
            console.error("Error en el login:", error)
            res.status(500).render("login", { errorMessage: "Error interno del servidor" })
        }

    }

    async current(req, res) {
        if (req.user) {
            if (req.user.role === 'admin') {
                // res.redirect('/realtimeproducts')
                res.redirect('/realtimeproducts')
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    }
    
    async logout(req, res) {
        res.clearCookie("coderCookieToken")
        res.redirect("/login")
    }

}

export default new UsersController()
