import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import {
    Server
} from 'socket.io'
// import productsRouter, {products} from "./routes/products.router.js"
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

// Config Mongoose
// mongoose.connect("mongodb+srv://EzeCordoba:Franco140@cluster0.9jzufs6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

//     .then(() => {
//         console.log("Conectado a la base de datos")
//     })
//     .catch(error => {
//         console.error("Error al conectar con la base de datos", error)
//     })



app.use("/", productsRouter)
app.use("/", cartsRouter)
app.use("/", viewsRouter)

// async function environment() {
const environment = async () => {
    await mongoose.connect("mongodb+srv://EzeCordoba:Franco140@cluster0.9jzufs6.mongodb.net/products_?retryWrites=true&w=majority&appName=Cluster0");

    // const inserts = await productModel.insertMany([
    //     {
    //         "name": "Galletitas",
    //         "description": "Galletitas base chocolate y relleno de crema",
    //         "code": "503405",
    //         "price": 2500,
    //         "status": true,
    //         "stock": 3,
    //         "category": "Alimento"
    //     },
    //     {

    //         "name": "Yerba",
    //         "description": "Yerba para mate con palo",
    //         "code": "YrbMt",
    //         "price":5500,
    //         "status": true,
    //         "stock":16,
    //         "category": "Almacen"
    //     },
    //     {
    //         "name": "Fideos Tallarín",
    //         "description": "FIDEOS TALLARIN LARGO X 500 GR",
    //         "code": "503609",
    //         "price":560,
    //         "status": true,
    //         "stock":7,
    //         "category": "Alimento"
    //     },
    //     {
    //         "name": "Gaseosa",
    //         "description": "Gaseosa Cola Black  1,5 Lt",
    //         "code": "410158",
    //         "price":1700,
    //         "status": true,
    //         "stock":9,
    //         "category": "Bebidas"
    //     },
    //     {
    //         "name": "Queso",
    //         "description": "QUESO RALLADO BOLSA 35 GR",
    //         "code": "472071",
    //         "price": 1400,
    //         "status": true,
    //         "stock":2,
    //         "category": "Quesos y fiambres"
    //     },
    //     {
    //         "name": "Miel",
    //         "description": "Miel pura y deliciosa",
    //         "code": "503405",
    //         "price":2500,
    //         "status": true,
    //         "stock":3,
    //         "category": "Alimento"
    //     },
    //     {
    //         "name": "Cerveza larger 473cc",
    //         "description": "CERVEZA HEINEKEN LAGER X 473 CC.",
    //         "code": "36311",
    //         "price":1300,
    //         "status": true,
    //         "stock": 10,
    //         "category": "Bebidas"
    //     },
    //     {
    //         "name": "Jugo de frutas 1 Lt",
    //         "description": "ADES Soja + Jugo de Frutas Tropicales 1 Lt",
    //         "code": "359512",
    //         "price":1690,
    //         "status": true,
    //         "stock":9,
    //         "category": "Bebidas"
    //     },
    //     {
    //         "name": "Jamon cocido 200gr",
    //         "description": "JAMON COCIDO LARIO X 200 Gr",
    //         "code": "479241",
    //         "price": 1560,
    //         "status": true,
    //         "stock": 12,
    //         "category": "Quesos y fiambres"
    //     }
    // ])

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


