
import User from "../models/usermodel.js";

export const updateUserController = async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        next('Please Provide all Fields')
    }
    const user = await User.findOne({ _id: req.user.userId })
    user.name = name
    user.email = email

    await user.save()
    const token = user.createJWT();
    res.status(200).json({
        user,
        token,
    });
}; 