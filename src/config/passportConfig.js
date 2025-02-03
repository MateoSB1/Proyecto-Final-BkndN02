import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/usersModel.js"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const initializePassport = () => {
    const cookieExtractor = req => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies["coderCookieToken"]
        }
        return token
    }
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: process.env.JWT_SECRET,
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
                    const newUser = {
                        first_name: profile.name.givenName || "",
                        last_name: profile.name.familyName || "",
                        email: profile.emails[0].value || "",
                        password: "",
                        role: "user",
                    }
                    const user = await User.create(newUser)
                    return done(null, user)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })
}

export default initializePassport