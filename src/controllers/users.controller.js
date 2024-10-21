import User from "../dao/classes/users.dao.js";
import { createHash, generateToken, isValidPassword } from "../utils.js";
import jwt from 'jsonwebtoken';

const usersService = new User()


export const getUser = async (req, res) => {
    // Validacion de los inputs del login
    const { email, password } = req.body
    if (!email || !password) return res.status(400).send({ status: "error", error: "Complete los campos por favor" })

    // Traer el usuario de mongo a traves del class User
    let user = await usersService.getUser(email)

    // Validación de la existencia del usuario y la contraseña
    if (!user) return res.status(400).send({ status: "error", error: "Usuario no encontrado" });
    if (!isValidPassword(user, password)) return res.status(403).send({ status: "error", error: "Campos incorrectos" })

    req.session.user = user
    const token = jwt.sign({ email, password, role: "user" }, "ezeSecret", { expiresIn: "24h" })
    res.cookie ("rol", req.session.user.role )

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
    })

    
    res.redirect('/profile')
}



export const saveUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body
        // Validacion del contenido de los campos
        if (!first_name || !last_name || !email || !age) {
            return res.status(400).send({ msg: 'Error, complete los campos' })
        }

        // Validacion de la existencia del usuario
        const verifyUser = await usersService.getUser( email )
        if (verifyUser) {
            return res.status(400).send({ status: "error", error: "Email ya en uso" });
        }


        // Creacion del obj user
        let user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role
        }


        // Guardado del usuario por medio del metodo saveUser()
        let newUser = await usersService.saveUser(user)
        res.cookie("jwt", generateToken(newUser), {
            httpOnly: true,
            secure: false
        })
        res.redirect('/login')

    } catch (error) {
        console.log(error);

    }
}