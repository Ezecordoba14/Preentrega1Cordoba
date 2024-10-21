import Product from "../dao/classes/product.dao.js";
import productModel from "../dao/models/product.model.js";

export const productService = new Product()
// //Traer todos los productos
export const getProducts = async (req, res) => {
    try {
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

        let products = await productService.getProducts(filter, options)

        let categoryString
        category ? categoryString = `&category=${category}` : categoryString = ""



        products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}${categoryString}` : "";
        products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}${categoryString}` : "";
        products.isValid = !(page <= 0 || page > products.totalPages);

        res.render("home", { products, filterCategory, categoryString });

        

    } catch (error) {
        console.error({ message: "Error al encontrar los productos", });
    }

}
// Traer producto por medio de params id
export const getProductById = async (req, res) => {
    try {

        let idProduct = req.params.pid;
        const product = await productService.getProductById(idProduct)
        res.render("detailProd", { product });
    } catch (error) {
        console.error({
            message: "Error al encontrar el producto",
        });
    }
}


//Crear un nuevo producto
export const saveProduct = async (req, res) => {
    try {
        const { name, description, code, price, status, stock, category } = req.body;
        if ((name == undefined) || (description == undefined) || (code == undefined) || (price == undefined) || (category == undefined)) {
            return res.status(400).json({
                msg: "Error, campo/s vacios",
            });
        }
        let product = {
            name,
            description,
            code,
            price,
            status: status ?? true,
            stock,
            category
        }
        const newProduct = await productService.saveProduct(product)

        res.status(200).json(newProduct)
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}
// Actulizar alguna propiedad de un product
export const updateProduct = async (req, res) => {
    try {
        let idProduct = req.params.pid;
        const filter = { _id: idProduct };
        const update = req.body;
        const productUpdate = await productService.updateProduct(filter, update)
        res.json({
            message: `Actualizado producto ${productUpdate}`,
        })
    } catch (error) {
        res.status(404).json({
            message: "Producto no encontrado o error al actualizar",
        });
    }
}
// Borrar un producto por medio de su id
export const deleteProductId = async (req, res) => {
    const idProduct = req.params.pid
    try {
        const productDelete = await productService.deleteProductId(idProduct)
        
        res.json({
            message: `Producto eliminado nombre:${productDelete.name}, id: ${idProduct}`,
        })
    } catch (error) {
        res.status(404).json({
            message: "Producto no encontrado",
        });
    }
}