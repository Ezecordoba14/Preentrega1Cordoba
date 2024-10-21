import express from 'express'
import { isAuthenticated, isNotAuthenticated, roleAdmin } from '../middleware/auth.js';

const router = express.Router()


router.get('/api/createproduct',roleAdmin, (req, res) => {
    res.render('createProduct')
  
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
router.get('/postPurchase',(req,res)=>{
    res.render('postPurchase')
})

export default router