import { Router } from "express"
import passport from "passport"
import UsersController from '../controllers/usersController.js'

const router = Router()

router.post('/register',UsersController.register)
router.post('/login',UsersController.login)
router.post('/logout',UsersController.logout)
router.get('/current', passport.authenticate('jwt', { session: false }), UsersController.current)

// Ruta para iniciar el flujo de autenticación de Google
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// Callback de Google OAuth
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/api/sessions/current", // Asegúrate de que esta ruta existe
        failureRedirect: "/login"
    })
);

router.post('/recuperate',UsersController.recuperate)

export default router
