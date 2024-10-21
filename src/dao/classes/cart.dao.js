import cartModel from "../models/cart.model.js"

export default class Cart {

    getCart = async (limit) => {
        try {
            let carts = await cartModel.find({}).lean()
            if (limit) {
                carts = await cartModel.find({}).limit(limit).lean()
            }
            return carts
        } catch (error) {
            console.log(error);
            return null
        }
    }


    getCartById = async (cartID, save) => {
        try {
            let cart = await cartModel.findOne({ _id: `${cartID}` }).lean().populate('products.product')
            return cart
        } catch (error) {
            console.log(error);
            return null
        }
    }

    newCart = async (products) => {
        try {
            const newCart = await cartModel({ products })
            newCart.save()
        } catch (error) {
            console.log(error);
            return null
        }
    }

    saveCart = async (cartID, productID, productAdd, quantity) => {
        try {
            let cart = await cartModel.findOne({ _id: `${cartID}` })
            const productCart = cart.products.find(prod => prod.product.toString() == productID);
            productCart? productCart.quantity += parseInt(quantity) : cart.products.push(productAdd)
            cart = await cart.populate('products.product')
            await cart.save();
        } catch (error) {
            console.log(error);
            return null
        }
    }


    deleteProdInCart = async (cartID, productsCart) => {
        try {
            await cartModel.findByIdAndUpdate(cartID, { products: productsCart })
        } catch (error) {
            console.log(error);
            return null
        }
    }
    clearCart = async (cartID) => {

        try {
            await cartModel.findByIdAndUpdate(cartID, { products: [] })
        } catch (error) {
            console.log(error);
            return null
        }
    }
    deleteCartById = async (cartID) => {
        try {
            await cartModel.findByIdAndDelete(cartID)
        } catch (error) {
            console.log(error);
            return null
        }
    }

}