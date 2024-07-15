const express = require("express")
const fs = require('fs')
const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
// ...........................................................................
let products
try {
    products = JSON.parse(fs.readFileSync("products.json", "utf8"))
} catch (error) {
    console.error('Error al leer los productos');
}
// ...........................................................................
// Traer producto por medio de params id
app.get("/api/products/:pid", (req, res) => {
    let idProduct = req.params.pid
    let product = products.find(product => product.id == idProduct)
    res.send({
        product
    })
})


// Traer todos los productos
app.get("/api/products", (req, res) => {
    let limite = parseInt(req.query.limit)
    let limiteProducts = [...products]

    if (!isNaN(limite) && limite > 0) {
        limiteProducts = limiteProducts.slice(0, limite)
    }
    res.send(limiteProducts)

})


// Crear un nuevo producto
app.post("/api/products", (req, res) => {
    const {
        name,
        description,
        code,
        price,
        stock,
        category
    } = req.body

    const {
        id
    } = products.at(-1)

    const newProduct = {
        id: `${parseInt(id) + 1}`,
        name: name,
        description: description || "",
        code: code || "",
        price: price || "",
        status: true,
        stock: stock || "",
        category: category || ""
    }

    const writeNewProduct = JSON.stringify([...products, newProduct])
    try {
        fs.writeFileSync('products.json', writeNewProduct)
    } catch (error) {
        console.error('Error al escribir el producto');
    }

    products.push(newProduct)
    res.send(newProduct);

})


// Actulizar alguna propiedad de un product
app.put("/api/products/:pid", (req, res) => {
    let idProduct = parseInt(req.params.pid)
    let productPUT = products.find(product => product.id == idProduct)

    if (productPUT) {
        const {
            name,
            description,
            code,
            price,
            stock,
            category
        } = req.body


        let productsPUT = products.map((product) => {
            if (product.id == productPUT.id) {
                return {
                    ...productPUT,
                    name: name || productPUT.name,
                    description: description || productPUT.description,
                    code: code || productPUT.code,
                    price: price || productPUT.price,
                    stock: stock || productPUT.stock,
                    category: category || productPUT.category
                }
            }
            return product
        })
        products = productsPUT

        try {
            fs.writeFileSync('products.json', JSON.stringify(productsPUT))
        } catch (error) {
            console.error('Error al actulizar productos');
        }


        res.json({
            message: `Actualizado producto id= ${productPUT.id}`
        })



    } else {
        res.status(404).json({
            message: "Producto no encontrado"
        })
    }

})


// Borrar un producto por medio de su id
app.delete("/api/products/:pid", (req, res) => {
    let idProduct = parseInt(req.params.pid)
    if (idProduct) {
        products = products.filter((product) => product.id != idProduct)
        res.json({
            message: `Producto con id ${idProduct} eliminado`
        })

        try {
            fs.writeFileSync('products.json', JSON.stringify(products))
        } catch (error) {
            console.error('No se ha podido borrar el producto');
        }

    } else {
        res.status(404).json({
            message: "Producto no encontrado"
        })
    }
})


// ...........................................................................
// Carts
let carts
try {
    carts = JSON.parse(fs.readFileSync('carts.json', "utf8"))
} catch (error) {
    console.error('No se pudo leer el carrito');
}
// ...........................................................................
// Leer el carrito por id
app.get("/api/carts/:cid", (req, res) => {
    let cartID = parseInt(req.params.cid)
    let cart = carts.find(cart => cart.id == cartID)
    res.send({
        cart
    })
})


// Leer el carrito 
app.get("/api/carts", (req, res) => {
    let limite = parseInt(req.query.limit)
    let limiteCart = [...carts]
    if (!isNaN(limite) && limite > 0) {
        limiteCart = limiteCart.slice(0, limite)
    }
    res.send(limiteCart)
})


// Crear un nuevo carrito
app.post("/api/carts", (req, res) => {
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
            fs.writeFileSync('carts.json', writeNewCart)
        } catch (error) {
            console.error('Error al escribir el producto');
        }
        carts.push(newCart)
    }

})

// Agregar un nuevo producto al carrito especifico
app.post("/api/:cid/product/:pid", (req, res) => {
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

    console.log(writeNewProductList);

    console.log(JSON.stringify(carts));
    try {
        fs.writeFileSync('carts.json', JSON.stringify(carts))
    } catch (error) {
        console.error('Error al escribir el producto');
    }




    res.send('Producto agregado')


})


