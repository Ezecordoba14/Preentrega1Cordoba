import { Router } from 'express';
import { authorization, generateToken, passportCall } from '../../utils.js';
import passport from 'passport';
import { getUser, saveUser } from '../../controllers/users.controller.js';

const router = Router();


router.post('/logout', (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("rol");
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
})


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.redirect ('/profile')   
})
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user
    res.cookie("jwt", generateToken(req.session.user), {
        httpOnly: true,
        secure: false
    })
    res.redirect('/profile')
})

router.post('/register', saveUser)

router.post('/login', getUser)

router.get('/current', passportCall('jwt'), authorization(), (req, res) => {
    res.send(req.user)
})

export default router