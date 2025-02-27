import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import User from "../dao/models/userModel.js"
import env from "./envs.js"

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET

const initializePassport = () => {
    const cookieExtractor = (req) => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies["coderCookieToken"]
        }
        return token
    }

    // Estrategia JWT
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: env.JWT_SECRET,
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    // Estrategia Google OAuth
    passport.use(
        "google",
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:3000/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const userFound = await User.findOne({ email: profile.emails[0].value })
                    if (userFound) {
                        return done(null, userFound)
                    }
    
                    const newUser = await User.create({
                        first_name: profile.name.givenName || "",
                        last_name: profile.name.familyName || "",
                        email: profile.emails[0].value || "",
                        password: "", // No se requiere contraseña para Google Auth
                        role: "user",
                    })
    
                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    // Serialización y deserialización de usuarios
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}

export default initializePassport