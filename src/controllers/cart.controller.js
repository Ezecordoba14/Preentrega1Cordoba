
import dotenvConfig from "../config/dotenv.config.js";
import Cart from "../dao/classes/cart.dao.js";
import { numberTicket, transport } from "../utils.js";
import { productService } from "./product.controller.js";


const cartService = new Cart()

// Obtener todos los carritos
export const getCart = async (req, res) => {
    try {
        let limite = parseInt(req.query.limit)
        let carts = await cartService.getCart(limite)

        if (carts.length == 0) {
            res.cookie('noCart', true)
        } else {
            res.cookie('noCart', false)
        }


        res.render('carts', { carts })
    } catch (error) {
        res.status(400).send({
            msg: "Error al mostrar los carritos"
        })
    }
}


// Obtener un carrito por id
export const getCartById = async (req, res) => {
    try {
        let cartID = req.params.cid
        let cart = await cartService.getCartById(cartID)

        if (cart.products.length == 0) {
            res.cookie('cartEmpty', true)
        } else {
            res.cookie('cartEmpty', false)
        }

        res.cookie('cartID', cartID)
        

        const subtotalPrice = cart.products.map((prod) => {
            let quantity = prod.quantity
            let price = prod.product.price

            return quantity * price

        })
        const totalPrice = subtotalPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

        const lengthCart = cart.products.length != 0

        res.render('cart', { cart, cartID, lengthCart, totalPrice })
    } catch (error) {
        res.status(400).send({
            msg: "Error el carrito"
        })
    }
}

// Crear un nuevo carrito
export const newCart = async (req, res) => {
    try {
        const products = []
        const newCart = await cartService.newCart(products)
        res.json({ mesg: 'Carrito creado' })
    } catch (error) {
        res.status(400).send({
            msg: "Error al crear el carrito"
        })
    }
}

// Cambiar carrito
export const changeCart = async (req, res) => {
    res.clearCookie('cartID')
    res.redirect('/carts')
}
// Agregar un producto al carrito
export const addProductInCart = async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        let { quantity } = req.body
        
        res.cookie('activeCart', true, {maxAge: 900000})

        const productRef = await productService.getProductById(productID)

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

        const cart = await cartService.getCartById(cartID)
        let prodInCart = cart.products.find((prod) => {
            if (prod.quantity >= productRef.stock) {
                prod.quantity = productRef.stock
                return prod.quantity
            }
        })
        if (prodInCart) {
            return res.status(400).send({
                error: "No se pueden agregar mas unidades",
            })
        }

        const productAdd = {
            product: productID.toString(),
            quantity: parseInt(quantity)
        }


        let newStockProduct = productRef.stock - parseInt(quantity)
        await productService.updateProduct(productID, { stock: newStockProduct })
        await cartService.saveCart(cartID, productID, productAdd, quantity)

        res.status(200).send({ msg: 'Producto agregado al carrito' })

    } catch (error) {
        res.status(401).send({
            msg: "Error al agregar el producto en el carrito"
        })
    }
}


// Borrar un producto del carrito
export const deleteProdInCart = async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid

        res.cookie('activeCart', true, {maxAge: 900000})

        const cart = await cartService.getCartById(cartID)
        if (!cart) {
            return (res.status(401).json({ msg: 'Error al encontrar el carrito' }))
        }


        const product = await productService.getProductById(productID)

        if (!product) {
            return (res.status(402).json({ msg: 'Error al encontrar el producto' }))
        }

        const cartProduct = cart.products.find(prod => prod.product._id == productID)
        const backStock = product.stock + cartProduct.quantity


        await productService.updateProduct(productID, { stock: backStock })



        const productsCart = cart.products.filter(prod => prod.product._id != productID);
        await cartService.deleteProdInCart(cartID, productsCart)

        res.json({ msg: 'Producto eliminado' })

    } catch (error) {

        res.status(400).send({
            msg: "Error el carrito"
        })
    }
}


// Limipiar carrito
export const clearCart = async (req, res) => {
    try {
        const cartID = req.params.cid
        const cart = await cartService.getCartById(cartID)
        if (cart.products.length == 0) {
            return res.status(400).json({ msg: 'Carrito ya vacio' })
        }

        cart.products.map(async (prod) => {
            let prodID = prod.product._id.toString()

            const backStock = prod.product.stock + prod.quantity
            await productService.updateProduct(prodID, { stock: backStock })

        })


        await cartService.clearCart(cartID)
        res.json({ msg: 'Carrito vaciado' })
    } catch (error) {
        res.status(400).json({ msg: 'Error al vaciar el carrito ' })
    }
}


// Eliminar carrito por id
export const deleteCartById = async (req, res) => {
    try {
        const cartID = req.params.cid

        await cartService.deleteCartById(cartID)

        res.send({ msg: 'Carrito elimando' })
    } catch (error) {
        res.status(400).send({ msg: 'Error al eliminar el carrito' })
    }

}


// Parte terminar compra
export const finishPurchase = async (req, res) => {
    const cartID = req.params.cid

    let cart = await cartService.getCartById(cartID)



    const noStockProd = cart.products.find(((prod) => {
        if (prod.quantity > prod.product.stock) {
            return res.status(400).send({
                error: "Producto con insuficiente stock",
            })
        }
    }))

    if (noStockProd) {
        cart = cart.products.filter(prod => prod.product._id != noStockProd.product._id)
    }

    const subtotalPrice = cart.products.map((prod) => {
        let quantity = prod.quantity
        let price = prod.product.price

        return quantity * price

    })
    const totalPrice = subtotalPrice.reduce((accumulator, currentValue) => accumulator + currentValue,0)

    try {
        cart.products.map(async (prod) => {

            const prodID = prod.product._id
            let newStock = prod.product.stock - prod.quantity
            await productService.updateProduct(prodID, { stock: newStock })
        })

        res.render('formPurchase', { cart, cartID, totalPrice })
    } catch (error) {
        console.log(error);

    }


}


// Mailing post compra
export const mailingPurchase = async (req, res) => {
    const pedidoID = req.params.cid
    const { email } = req.body

    const cart = await cartService.getCartById(pedidoID)

    const subtotalPrice = cart.products.map((prod) => {
        let quantity = prod.quantity
        let price = prod.product.price

        return quantity * price

    })
    const totalPrice = subtotalPrice.reduce((accumulator, currentValue) => accumulator + currentValue,
        0)


    const htmlProducts = cart.products.map((prod) => {
        const htmlProd = `
                <h4>
                    ${prod.product.name}
                </h4>
                <span>Cantidades: ${prod.quantity}</span>
                <span>Precio: ${prod.product.price}</span>
`

        return htmlProd
    })



    let result = await transport.sendMail({
        from: `${dotenvConfig.USER_NODEMAILER}`,
        to: `${email}`,
        subject: 'Correo de prueba',
        html: `
            <div>
                <h1>¡Muchas gracias por tu compra!</h1>
                <p>Estamos muy contentos que hayas realizado una compra en nuestra página, pronto nos estaremos contactando para acordar el envío.</p>
                <h3>Detalles del pedido con el id: ${numberTicket}</h3>
                ${htmlProducts}
                <h4>Total: $ ${totalPrice}</h4>
                <p>Cualquier duda comunicate al +54 11 2282 XXXX o responde este email</p>
            </div>
            `,
        attachments: []

    })


    res.redirect('/postPurchase')
}
