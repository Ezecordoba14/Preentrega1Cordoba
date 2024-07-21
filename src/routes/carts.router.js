import { Router } from "express"
import { readFileSync, writeFileSync } from 'fs'

const router = Router()

// ...........................................................................
let carts
try {
    carts = JSON.parse(readFileSync('carts.json', "utf8"))
} catch (error) {
    console.error('No se pudo leer el carrito');
}
// ...........................................................................
// Leer el carrito por id
router.get("/api/carts/:cid", (req, res) => {
    let cartID = parseInt(req.params.cid)
    let cart = carts.find(cart => cart.id == cartID)
    res.send({
        cart
    })
})


// Leer el carrito 
router.get("/api/carts", (req, res) => {
    let limite = parseInt(req.query.limit)
    let limiteCart = [...carts]
    if (!isNaN(limite) && limite > 0) {
        limiteCart = limiteCart.slice(0, limite)
    }
    res.send(limiteCart)
})


// Crear un nuevo carrito
router.post("/api/carts", (req, res) => {
    const {
        products
    } = req.body

    const {
        id
    } = carts.at(-1)


    if (products) {
        res.send({
            message: "Producto agregado"
        })

        const newCart=({
            id: `${parseInt(id) + 1}`,
            products
        })

        const writeNewCart = JSON.stringify([...carts, newCart])
        try {
            writeFileSync('carts.json', writeNewCart)
        } catch (error) {
            console.error('Error al escribir el producto');
        }
        carts.push(newCart)
    }

})

// Agregar un nuevo producto al carrito especifico
router.post("/api/:cid/product/:pid", (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid

    const productAdd = {
        id: productID,
        quantity: 1
    }


    const cartIdx = carts.findIndex(cart => cart.id == cartID)
    const productList = carts[cartIdx].products

    if (cartIdx !== -1) {
        productList.push(productAdd);
    }

    const writeNewProductList = JSON.stringify([...productList, productAdd])


    try {
        writeFileSync('carts.json', JSON.stringify(carts))
    } catch (error) {
        console.error('Error al escribir el producto');
    }




    res.send('Producto agregado')


})


export default router
