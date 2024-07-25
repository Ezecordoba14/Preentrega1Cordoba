import { Router } from "express"
import { readFileSync, writeFileSync } from 'fs'


const router = Router()
// ...........................................................................
export let products
try {
    products = JSON.parse(readFileSync("products.json", "utf8"))
} catch (error) {
    console.error('Error al leer los productos');
}
// ...........................................................................
// Traer producto por medio de params id
router.get("/api/products/:pid", (req, res) => {
    let idProduct = req.params.pid
    let product = products.find(product => product.id == idProduct)
    res.render('home',{
        product
    })
})


// Traer todos los productos
router.get("/api/products", (req, res) => {
    let limite = parseInt(req.query.limit)
    let limiteProducts = [...products]

    if (!isNaN(limite) && limite > 0) {
        limiteProducts = limiteProducts.slice(0, limite)
    }
    res.render('home', {limiteProducts})

})


// Crear un nuevo producto
router.post("/api/products", (req, res) => {
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
        writeFileSync('products.json', writeNewProduct)
    } catch (error) {
        console.error('Error al escribir el producto');
    }

    products.push(newProduct)
    res.send(newProduct);



})


// Actulizar alguna propiedad de un product
router.put("/api/products/:pid", (req, res) => {
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
            writeFileSync('products.json', JSON.stringify(productsPUT))
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
router.delete("/api/products/:pid", (req, res) => {
    let idProduct = parseInt(req.params.pid)
    if (idProduct) {
        products = products.filter((product) => product.id != idProduct)
        res.json({
            message: `Producto con id ${idProduct} eliminado`
        })

        try {
            writeFileSync('products.json', JSON.stringify(products))
        } catch (error) {
            console.error('No se ha podido borrar el producto');
        }

    } else {
        res.status(404).json({
            message: "Producto no encontrado"
        })
    }
})


export default router