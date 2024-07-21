import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

