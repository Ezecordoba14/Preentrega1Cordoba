import express from 'express'
// import { socketServer } from '../app.js'

import { readFileSync } from 'fs'

const router = express.Router()

let products
try {
    products = JSON.parse(readFileSync("products.json", "utf8"))
} catch (error) {
    console.error('Error al leer los productos');
}

router.get('/api/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
    
    
})

// socketServer.emit("productLogs", products)


export default router