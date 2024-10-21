import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoUrlProducts: process.env.MONGO_URL_PRODUCTS,
    secretKey: process.env.SECRETKEY,
    privateKey: process.env.PRIVATE_KEY,
    clientSecret: process.env.CLIENTSECRET,
    USER_NODEMAILER: process.env.USER_NODEMAILER,
    PASS_NODEMAILER: process.env.PASS_NODEMAILER
}