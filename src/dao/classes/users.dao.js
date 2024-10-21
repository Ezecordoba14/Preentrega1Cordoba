import userModel from "../models/users.js"

export default class User {
    getUser = async (email) => {
        try {
            let user = await userModel.findOne({ email });
            return user
        } catch (error) {
            console.log(error);
            return null
        }
    }
    saveUser = async (user) => {
        try {
            let result = await userModel.create(user)
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }
    updateUser = async (id, user) => {
        try {
            let result = await userModel.updateOne({ _id: id }, { $set: user })
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }
}