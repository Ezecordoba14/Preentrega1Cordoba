import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import dotenvConfig from './config/dotenv.config.js'
import nodemailer from 'nodemailer'
import { v4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const PRIVATE_KEY = `${dotenvConfig.privateKey}`

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' })
    return token
}


export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            }

            req.user = user
            next()
        })

            (req, res, next)
    }
}


export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "Unauthorized" })
        if (req.user.role !== role) return res.status(403).send({ error: "No permission" })
        next()
    }
}





export async function getData() {
    const response = await fetch('http://localhost:8080/api/carts')
    console.log(response);
    
}

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: `${dotenvConfig.USER_NODEMAILER}`,
        pass: `${dotenvConfig.PASS_NODEMAILER}`
    },
    tls: {
        rejectUnauthorized: false
    }
})
export const numberTicket = v4()

export default __dirname