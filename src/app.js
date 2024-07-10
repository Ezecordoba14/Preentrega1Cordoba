const express = require("express")
const fs = require('fs')
const app = express()
const PORT = 8080


// Middelwares
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
// ...........................................................................
/*
writeFileSync = Escritura de un archivo de manera sincronica
readFileSync = Lectura de un archivo de manera sincronica
appendFileSync = Actualizar un archivo de manera sincronica
unlinkSync = Elimina un archivo de manera sincronica
mkdirSync = Crear carpetas de manera sincronica
*/

let products

try {
    products = JSON.parse(fs.readFileSync("products.json", "utf8"))
} catch (error) {
    console.error('Error al leer los productos');
}


// console.log(products);
// Mock
// let products = [{
//         id: "1",
//         producto: "Soja"
//     },
//     {
//         id: "2",
//         producto: "Sevada"
//     },
//     {
//         id: "3",
//         producto: "Soja"
//     },
//     {
//         id: "4",
//         producto: "Sevada"
//     },
//     {
//         id: "5",
//         producto: "Soja"
//     },
//     {
//         id: "6",
//         producto: "Sevada"
//     },
//     {
//         id: "7",
//         producto: "Soja"
//     },
//     {
//         id: "8",
//         producto: "Sevada"
//     },
//     {
//         id: "9",
//         producto: "Maíz"
//     }
// ]



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

let carts=[
    {id:1,
        products: []
    },
    {id:2,
        products: []
    },
    {id:3,
        products: []
    }
]

app.get("/api/carts/:cid", (req, res) => {
    const cartID= req.params.cid
    res.send(carts)
    console.log(cartID);
})



app.get("/api/carts", (req, res) => {
    res.send(carts)
})


// cartsProducts={
//     id,
//     ListProducts
// }

app.post("/api/carts", (req,res)=>{
    res.send({message: 'Posteado'})

    // const {products} = req.body

    // console.log(products);



})


app.post("/api/carts/:cid/product/:pid", (req,res)=>{
    const productID = req.params.pid 

    const ListProductsFind= products.find((product)=> product.id == productID)

    console.log(ListProductsFind);

    const {products} = req.body



})