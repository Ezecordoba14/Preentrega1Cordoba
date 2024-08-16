import { Router } from "express"
import { readFileSync, writeFileSync } from 'fs'
import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"
import { error } from "console"
import mongoose from "mongoose"

const router = Router()

// ...........................................................................
// let carts
// try {
//     carts = JSON.parse(readFileSync('carts.json', "utf8"))
// } catch (error) {
//     console.error('No se pudo leer el carrito');
// }
// ...........................................................................

// Leer el carrito 
router.get("/api/carts", async (req, res) => {
    let limite = parseInt(req.query.limit)
    let carts = await cartModel.find({}).lean()
    if (limite) {
        carts = await cartModel.find({}).limit(limite).lean()
    }

    res.render('carts', { carts })

})

// Leer el carrito por id
router.get("/api/carts/:cid", async (req, res) => {
    let cartID = req.params.cid
    let cart = await cartModel.findOne({ _id: `${cartID}` }).lean().populate('products.product')

    res.render('carts', { cart, cartID })

})



// Crear un nuevo carrito
router.post("/api/carts", async (req, res) => {
    try {
        const products = []

        const newCart = await cartModel({ products })
        newCart.save()
        res.json({ mesg: 'Carrito creado' })
    } catch (error) {
        res.status(402).send({
            msg: "Error al crear el carrito",
            error
        })
    }
})



// Agregar un nuevo producto al carrito especifico

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        let { quantity } = req.body

        const productRef = await productModel.findById(productID)

        if (quantity > productRef.stock || productRef.stock <= 0) {
            quantity = 0
            return res.status(401).send({
                error: "Producto con insuficiente stock",
            })
        } else if (quantity == undefined || quantity < 1) {
            return res.status(402).send({
                error: "Indique las cantidades deseadas",
            })
        }

        const productAdd = {
            product: productID.toString(),
            quantity: parseInt(quantity)
        }

        let cart = await cartModel.findById(cartID);

        const productCart = cart.products.find(prod => prod.product.toString() == productID);


        productCart ? productCart.quantity += parseInt(quantity) : cart.products.push(productAdd)


        let newStockProduct = productRef.stock - parseInt(quantity)
        let updateProduct = await productModel.findByIdAndUpdate({ _id: productID }, { stock: newStockProduct }, { new: true })
        await updateProduct.save();
        await cart.save();
        cart = await cart.populate('products.product')

        res.status(200).send({ msg: 'Producto agregado al carrito' })
    } catch (error) {
        res.status(403).send({ msg: 'Error al agregar el producto al carrito' })
    }

})


// Eliminar producto del carrito
router.delete("/api/carts/:cid/product/:pid", async (req, res) => {

    try {
        const cartID = req.params.cid
        const productID = req.params.pid


        const cart = await cartModel.findById(cartID)
        if (!cart) {
            return (res.status(401).json({ msg: 'Error al encontrar el carrito' }))
        }

        const product = await productModel.findById(productID)

        const cartProduct = cart.products.find(prod => prod.product == productID)

        const backStock = product.stock + cartProduct.quantity


        const validationProduct = await productModel.findById(productID)

        if (!validationProduct) {
            return (res.status(402).json({ msg: 'Error al encontrar el producto' }))
        }
        await productModel.findByIdAndUpdate(productID, { stock: backStock })
        const productsCart = cart.products.filter(prod => prod.product != productID);
        await cartModel.findByIdAndUpdate(cartID, { products: productsCart })

        res.json({ msg: 'Producto eliminado' })

    } catch (error) {
        res.status(403).json({ msg: 'error al eliminar el producto ' + error })
    }


})
// Eliminar todos los productos del carrito
router.put("/api/carts/:cid", async (req, res) => {
    try {
        const cartID = req.params.cid

        const cart = await cartModel.findById(cartID)
        console.log(cart.products.length);
        if (cart.products.length == 0) {
            return res.status(400).json({ msg: 'Carrito ya vacio' })
        }
        await cartModel.findByIdAndUpdate(cartID, { products: [] })

        res.json({ msg: 'Carrito vaciado' })
    } catch (error) {
        res.status(400).json({ msg: 'Error al vaciar el carrito ', error })
    }
})


// Eliminar carrito especifico
router.delete("/api/carts/:cid", async (req, res) => {
    try {
        const cartID = req.params.cid

        await cartModel.findByIdAndDelete(cartID)

        res.send({ msg: 'Carrito elimando' })
    } catch (error) {
        res.status(400).send({ msg: 'Error al eliminar el carrito', error })
    }
})


// Actualizar cantidades de un producto del carrito
router.put('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid

        let { quantity } = req.body


        const productRef = await productModel.findById(productID)

        if (quantity > productRef.stock || productRef.stock <= 0) {
            quantity = 0
            return res.status(400).send({
                error: "Producto con insuficiente stock",
            })
        } else if (quantity == undefined || quantity < 1) {
            return res.status(400).send({
                error: "Indique las cantidades deseadas",
            })
        }


        const cart = await cartModel.findById(cartID)
        const productCart = cart.products.find(prod => prod.product == productID)
        let newStockProduct = productRef.stock + (productCart.quantity - quantity)

        productCart.quantity = quantity
        let updateProduct = await productModel.findByIdAndUpdate({ _id: productID }, { stock: newStockProduct }, { new: true })
        await updateProduct.save();
        await cart.save()

        res.json({ msg: 'cantidades actualizadas' })

    } catch (error) {
        return res.status(400).send({
            msg: "Error al actualizar las cantidades del producto", error
        })
    }
})
export default router
