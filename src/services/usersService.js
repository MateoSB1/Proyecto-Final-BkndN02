import UserRepository from '../repositories/userRepository.js'
import CartRepository from '../repositories/cartRepository.js'
import UserDTO from '../dto/userDTO.js'
import { isValidPassword, createHash } from '../utils/utils.js'
import Cart from '../dao/models/cartModel.js'

class UserService {
    async createUser(userData) {
        const userDTO = new UserDTO(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.age,
            userData.username,
            userData.role,
        )
        const userToSave = {
            ...userDTO,
            password: createHash(userData.password)
        }
        return await UserRepository.createUser(userToSave)
    }

    async getUsers() {
        return await UserRepository.getUsers()
    }

    async getUserById(id) {
        return await UserRepository.getUserById(id)
    }

    async updateUser(id, userData) {
        const userDTO = new UserDTO(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.age,
            userData.username,
            userData.role
        )
        let userToUpdate = { ...userDTO }
        if (userData.password) {
            userToUpdate.password = createHash(userData.password)
        }
        return await UserRepository.updateUser(id, userToUpdate)
    }

    async deleteUser(id) {
        return await UserRepository.deleteUser(id)
    }
    
    async registerUser(userData) {
        const existingUserByEmail = await UserRepository.getUserByEmail(userData.email)
        if (existingUserByEmail) {
            throw new Error('El correo electrónico ya está registrado')
        }

        const existingUserByUsername = await UserRepository.getUserByUsername(userData.username)
        if (existingUserByUsername) {
            throw new Error('El nombre de usuario ya está registrado')
        }

        const { cartDTO, _id } = await CartRepository.createCart()
        userData.cart = _id

        userData.password = createHash(userData.password)

        return await UserRepository.createUser(userData)
    }

    async loginUser(usernameOrEmail, password) {
        let user
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(usernameOrEmail)) {
            user = await UserRepository.getUserByEmail(usernameOrEmail)
        } else {
            user = await UserRepository.getUserByUsername(usernameOrEmail)
        }

        if (!user || !isValidPassword(password, user)) {
            throw new Error("Credenciales incorrectas")
        }
        return user
    }
    
    async getCartByUserId(userId) {
        return await UserRepository.getCartByUserId(userId)
    }
}

export default new UserService()
