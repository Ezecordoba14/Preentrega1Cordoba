import passport from "passport";
import local from "passport-local";
import userModel from '../models/users.js'
import { createHash, generateToken, isValidPassword } from '../utils.js';
import gitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'


const localStrategy = local.Strategy

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) => {
    let token = null
    console.log(req.headers)
    if (req && req.headers) {
        token = req.headers.authorization.split(' ')[1]
    }
    return token
}

const initializePassport = () => {
    // passport.use('register', new localStrategy(
    //     { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
    //         const { first_name, last_name, email, age, cartId } = req.body
    //         // try {
    //             let user = await userModel.findOne({ email: username })
    //             if (user) return done(null, false)
    //                 const newUser = {
    //                     first_name,
    //                     last_name,
    //                     email,
    //                     age,
    //                     password: createHash(password),
    //                     cartId,
    //                 }
    //                 let createUser = await userModel.create (newUser)
    //                 return done (null, createUser)
    //         // } catch (error) {
    //         //     return done (`Error al obtener el usuario: ${error}`)
    //         // }
    //     }
    // ))
    
    // passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
    //     try {
    //         const user = await userModel.findOne({ email: username })
    //         if (!user) {
    //             console.log("El usuario no encontrado")
    //             return done(null, false)
    //         }
    //         if (!isValidPassword(user, password)) return done(null, false)
    //         return done(null, user)
    //     } catch (error) {
    //         return done(error)
    //     }
    // }))

// --------------



    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })


    passport.use('github', new gitHubStrategy({
        clientID: "Iv23liEpz796SRMAGpHm",
        clientSecret: "130cb9024f539d89795f911daae2fa842df1d7a1",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
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