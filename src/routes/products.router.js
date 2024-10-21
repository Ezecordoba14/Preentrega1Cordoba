import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import productModel from "../dao/models/product.model.js";
import { deleteProductId, getProductById, getProducts, saveProduct, updateProduct } from "../controllers/product.controller.js";
import { roleAdmin, roleUser } from "../middleware/auth.js";

const router = Router();

// ...........................................................................
// Traer producto por medio de params id
router.get('/api/products/:pid', getProductById)

// //Traer todos los productos
router.get("/api/products", getProducts)

//Crear un nuevo producto
router.post('/api/products', roleAdmin ,saveProduct)
router.post(`/api/carts/:cid/product/:pid`, roleUser)

// Actulizar alguna propiedad de un product
router.put("/api/products/:pid", roleAdmin ,updateProduct)

// Borrar un producto por medio de su id
router.delete("/api/products/:pid", roleAdmin ,deleteProductId)

export default router;
