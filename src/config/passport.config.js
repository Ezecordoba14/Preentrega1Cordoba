import passport from "passport";
import local from "passport-local";
import userModel from '../dao/models/users.js'
import gitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import dotenvConfig from "./dotenv.config.js";


const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) => {
    let token = null
    if (req && req.headers) {
        token = req.headers.authorization.split(' ')[1]
    }
    return token
}

const initializePassport = () => {

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })


    passport.use('github', new gitHubStrategy({
        clientID: "Iv23liEpz796SRMAGpHm",
        clientSecret: `${dotenvConfig.clientSecret}`,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.last_name || '',
                    email: profile._json.email,
                    age: 20,
                    password: '',
                    cartId: 1,
                }
                const createUser = await userModel.create(newUser)
                done(null, createUser)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))


    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'ezeSecret'
    }, async (jwt_payload, done) => {
        try {
            const user = await userModel.findById(jwt_payload.id)
            if (user) {
                return done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id)
        done(null, user)
    })


}

export default initializePassport