import { Router } from 'express';
import { authorization, createHash, generateToken, isValidPassword, passportCall, PRIVATE_KEY } from '../../utils.js';
import userModel from '../../models/users.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// router.post('/register', async (req, res) => {
//     const { first_name, last_name, email, age, password, role } = req.body

//     if (!first_name || !last_name || !email || !age ) {
//         console.log(first_name , last_name , email , age );

//         return res.status(400).send({ msg: 'Errorrrr' })
//     }
//     let user = {
//         first_name,
//         last_name,
//         email,
//         age,
//         password: createHash(password),
//         role
//     }

//     const newUser = new userModel({ first_name, last_name, email, age, password: createHash(password), role })
//     await newUser.save()
//     // res.send({ user })
//     res.redirect('/login')
// })
// { failureRedirect: '/failregister' })


// router.post('/register', passport.authenticate('register'), async (req, res) => {
//     res.send({ status: "success", message: "usuario registrado" })
// });

// router.get('/failregister', async (req, res) => {
//     console.log('Estrategia fallida')
//     res.send({ error: "Failed" })
// })



// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) return res.status(400).send({ status: "error", error: "Complete los campos por favor" })

//     const user = await userModel.findOne({ email });
//     if (!user) return res.status(400).send({ status: "error", error: "Usuario no encontrado" });
//     if (!isValidPassword(user, password)) return res.status(403).send({ status: "error", error: "Campos incorrectos" })
//     req.session.user = user
//     console.log(user);
//     // res.send(user)
//     res.redirect('/profile')

// })
// ---------------------------------

// router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
//     // const { email, password } = req.body;
//     if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales invalidas" })

//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         age: req.user.age,
//         email: req.user.email,
//     }

//     res.send({ status: "success", payload: req.user })
// });

// router.get('/faillogin', (req, res) => {
//     res.send("Login fallido")
// })



router.post('/logout', (req, res) => {
    res.clearCookie("jwt");
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
})
// ------------------------

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    console.log(req.session.user);

    // res.redirect ('/profile')   
})
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user
    res.cookie("jwt", generateToken(req.session.user), {
        httpOnly: true,
        secure: false
    })
    res.redirect('/profile')
})
// --------------------------

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body

    try {
        if (!first_name || !last_name || !email || !age) {
            return res.status(400).send({ msg: 'Error, complete los campos' })
        }

        const verifyUser = await userModel.findOne({ email })
        if (verifyUser) return res.status(400).send({ msg: "El correo electrónico ya fue usado" });

        let user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role
        }

        const newUser = new userModel(user)
        await newUser.save()
        res.cookie("jwt", generateToken(newUser), {
            httpOnly: true,
            secure: false
        })
        // res.send({status: 'success', access_token})
        // res.send({ user })
        res.redirect('/login')
    } catch (error) {
        res.send({ msg: 'Error al registrar usuario', error })
    }
})



router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).send({ status: "error", error: "Complete los campos por favor" })

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send({ status: "error", error: "Usuario no encontrado" });
    if (!isValidPassword(user, password)) return res.status(403).send({ status: "error", error: "Campos incorrectos" })
    req.session.user = user
    console.log(user);
    const token = jwt.sign({ email, password, role: "user" }, "ezeSecret", { expiresIn: "24h" })

    // res.send(user)
    // const access_token = generateToken(user)
    // res.send({status: 'success', access_token, token})
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
    })
    res.redirect('/profile')

})

router.get('/current', passportCall('jwt'), authorization('user'), (req, res) => {
    res.send(req.user)
})


export default router