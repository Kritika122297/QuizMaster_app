
import userModel from "../models/usermodel.js";
import validator from 'validator';



export const registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username) return next("Username is required");
        if (!email) return next("Email is required");
        if (!password) return next("Password is required");

        const existingUser = await userModel.findOne({ email });
        if (existingUser) return next("Email already registered. Please log in.");

        const user = await userModel.create({ username, email, password });

        const token = user.createJWT();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                username: user.username,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        next(error); 
    }
};


export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) return next("Please provide the required fields");

        const user = await userModel.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, error: "Invalid username or password" });
        }

        user.password = undefined;

        const token = user.createJWT();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token,
        });

    } catch (error) {
        return next(error);
    }
};


export const logoutController = async (req, res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({message: 'Logged out successfully'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};