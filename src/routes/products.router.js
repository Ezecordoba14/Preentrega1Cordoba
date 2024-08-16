import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import productModel from "../models/product.model.js";

const router = Router();

// ...........................................................................
// Traer producto por medio de params id
router.get("/api/products/:pid", async (req, res) => {
    try {

        let idProduct = req.params.pid;
        let product = await productModel.findOne({ _id: idProduct, }).lean();
        res.render("home", { product });
        // console.log(product);
    } catch (error) {
        console.error({
            message: "Error al encontrar el producto",
        });
    }
});

// Traer todos los productos
router.get("/api/products", async (req, res) => {
    try {
        // AVISO!!! el query params que se debería llamar "query" decidí llamarlo "category" por facilidad y simplicidad
        const { page = 1, sort, limit = 10, category } = req.query

        let filter = {}
        category == undefined ? filter = {} : filter = { category: `${category}` }

        // Filtro
        let filterCategory = await productModel.aggregate([
            { $group: { _id: "$category", }, },
            { $sort: { _id: 1, }, },
        ]);

        let sortParams
        if (sort == 'nameAsc') {
            sortParams = { name: 1 }
        } else if (sort == 'nameDesc') {
            sortParams = { name: -1 }
        } else if (sort == 'priceAsc') {
            sortParams = { price: 1 }
        } else if (sort == 'priceDesc') {
            sortParams = { price: -1 }
        }

        let options = {
            page: parseInt(page),
            limit: parseInt(limit, 10),
            sort: sort ? sortParams : {},
            lean: true
        }


        let products = await productModel.paginate(filter, options);

        let categoryString
        category ? categoryString = `&category=${category}` : categoryString = ""



        products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}${categoryString}` : "";
        products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}${categoryString}` : "";
        products.isValid = !(page <= 0 || page > products.totalPages);


        // res.status(200).json({
        //     status: 'success',
        //     payload: products.docs,
        //     totalPages: products.totalPages,
        //     prevPage: products.prevPage,
        //     nextPage: products.nextPage,
        //     page: products.page,
        //     hasPrevPage: products.hasPrevPage,
        //     hasNextPage: products.hasNextPage,
        //     prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}${categoryString}` : null,
        //     nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}${categoryString}` : null
        // })



        res.render("home", { products, filterCategory, categoryString });
    } catch (error) {
        console.error({ message: "Error al encontrar los productos", });
        // res.status(500).json({ status: 'error', msg: error.message });
    }


});


// Crear un nuevo producto

router.post('/api/products', async (req, res) => {
    const { name, description, code, price, status, stock, category } = req.body;

    if ((name == undefined) || (description == undefined) || (code == undefined) || (price == undefined) || (category == undefined)) {
        return res.status(400).json({
            msg: "Error, campo/s vacios",
        });
    }

    const newProduct = new productModel({
        name, description, code, price, status: status ?? true, stock, category
    });

    try {
        const saveNewProduct = await newProduct.save()
        res.status(200).json(saveNewProduct)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})

// Actulizar alguna propiedad de un product
router.put("/api/products/:pid", async (req, res) => {
    let idProduct = req.params.pid;
    const filter = { _id: idProduct };
    const update = req.body;

    try {
        const productUpdate = await productModel.findByIdAndUpdate(filter, update, { new: true })
        res.json({
            message: `Actualizado producto ${productUpdate}`,
        })
    } catch (error) {
        res.status(404).json({
            message: "Producto no encontrado o error al actualizar",
        });
    }

});

// Borrar un producto por medio de su id
router.delete("/api/products/:pid", async (req, res) => {
    const idProduct = req.params.pid
    try {
        const productDelete = await productModel.findByIdAndDelete(idProduct)
        res.json({
            message: `Producto eliminado nombre:${productDelete.name}, id: ${idProduct}`,
        })
    } catch (error) {
        res.status(404).json({
            message: "Producto no encontrado",
        });
    }

});

export default router;
