import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import {Server} from 'socket.io'
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



const app = express()
const PORT = 8080

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
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://EzeCordoba:Franco140@cluster0.9jzufs6.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0' }),
    secret: 'secretkey',
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

const socketServer = new Server(httpServer)






socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado")

    socketServer.emit("productLogs", products)
    socket.on('message', () => {
        socketServer.emit("productLogs", products)
    })

    socket.on("delete", () => {
        socketServer.emit("productLogs", products)
    })

})


