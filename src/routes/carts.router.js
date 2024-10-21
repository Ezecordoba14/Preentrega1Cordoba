import { Router } from "express"
import { addProductInCart, changeCart, clearCart, deleteCartById, deleteProdInCart, finishPurchase, getCart, getCartById, mailingPurchase, newCart } from "../controllers/cart.controller.js"
import { roleUser } from "../middleware/auth.js"

const router = Router()

// Leer el carrito 
router.get("/api/carts", getCart)

// Leer el carrito por id
router.get("/api/carts/:cid", getCartById)

// Crear un nuevo carrito
router.post("/api/carts", newCart)

// Cambiar carrito
router.post("/api/changeCart", changeCart)

// Agregar un nuevo producto al carrito especifico
router.post("/api/carts/:cid/product/:pid", roleUser, addProductInCart)

// Eliminar producto del carrito
router.delete("/api/carts/:cid/product/:pid", deleteProdInCart)

// Eliminar todos los productos del carrito
router.put("/api/carts/:cid", clearCart)

// Eliminar carrito especifico
router.delete("/api/carts/:cid", deleteCartById)

// Terminar compra
router.get('/api/:cid/purchase', finishPurchase)

router.post('/api/:cid/purchase', mailingPurchase)

export default router
