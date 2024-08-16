import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import {
    Server
} from 'socket.io'
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import mongoose from 'mongoose'




const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Config Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use("/", productsRouter)
app.use("/", cartsRouter)
app.use("/", viewsRouter)

const environment = async () => {
    await mongoose.connect("mongodb+srv://EzeCordoba:Franco140@cluster0.9jzufs6.mongodb.net/products_?retryWrites=true&w=majority&appName=Cluster0");



}

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


