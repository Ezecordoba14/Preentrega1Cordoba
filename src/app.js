import express from 'express'
import __dirname from './utils.js'
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import sessionsRouter from './routes/api/sessions.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js'
import cookieParser from 'cookie-parser';
import { environment } from './config/database.js';
import dotenvConfig from './config/dotenv.config.js'



const app = express()
const PORT = dotenvConfig.port

// app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Config Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    store: MongoStore.create({ mongoUrl: `${dotenvConfig.mongoUrl}` }),
    secret: `${dotenvConfig.secretKey}`,
    resave: false,
    saveUninitialized: true
}));

app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())


app.use("/", productsRouter)
app.use("/", cartsRouter)
app.use("/", viewsRouter)
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);



initializePassport()
environment()



const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))




