import express from 'express'
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
// import { socketServer } from '../app.js'

import { readFileSync } from 'fs'

const router = express.Router()

let products
try {
    products = JSON.parse(readFileSync("products.json", "utf8"))
} catch (error) {
    console.error('Error al leer los productos');
}

router.get('/api/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
  
})

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});


export default router