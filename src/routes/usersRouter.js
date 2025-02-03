import { Router } from "express"
import User from "../models/usersModel.js"

const router = Router()

router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body)
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json({ message: 'Usuario eliminado' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

export default router