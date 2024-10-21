import productModel from "../models/product.model.js";

export default class Product {
    getProducts = async (filter, options) => {
        try {
            let products = await productModel.paginate(filter, options);
            
            return products
        } catch (error) {
            console.log(error);
            return null
        }
    }



    getProductById = async (idProduct) => {
        try {
            let product = await productModel.findOne({ _id: idProduct, }).lean();
            return product
        } catch (error) {
            console.log(error);
            return null
        }
    }


    saveProduct = async (product) => {
        try {
            const newProduct = new productModel(product);
            const saveNewProduct = await newProduct.save()
            return saveNewProduct
        } catch (error) {
            console.log(error);
            return null
        }
    }


    updateProduct = async (filter, update) => {
        try {
            const productUpdate = await productModel.findByIdAndUpdate(filter, update, { new: true })
            return productUpdate
        } catch (error) {
            console.log(error);
            return null
        }
    }



    deleteProductId = async (idProduct) => {
        try {
        const productDelete = await productModel.findByIdAndDelete(idProduct)
        return productDelete
        } catch (error) {
            console.log(error);
            return null
        }
    }
}