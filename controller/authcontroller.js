import User from '../models/usermodel.js';
import bcrypt from 'bcryptjs';


// const comparePassword=async function (userPassword) {
//     const isMatch = await bcrypt.compare(userPassword, this.password)
//     return isMatch;
// }

export const registerController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        //validate
        if (!name) {
            next('Please Provide all the Credentials');
        }
        if (!email) {
            next('Please Provide all the Credentials');
        }
        if (!password) {
            next('Please Provide all the Credentials');
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            next("Email Already Register Please Login");
        }
        const user = await User.create({ name, email, password })
        await user.save();
        res.status(201).send({
            success: true,
            message: 'User Created Successfully',
            user,
        })
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        next('Please Provide the required Fields');
        return; // Add return to avoid executing the rest of the code after the response is sent.
    }

    // Find user by email, including the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        next('Invalid Username or Password');
        return;
    }

    // Compare password using the instance method
    const isMatch = await user.comparePassword(password); // Call on the user instance
    if (!isMatch) {
        next('Invalid Username or Password');
        return;
    }

    user.password = undefined; // Don't send password back to the client

    // Create a JWT token
    const token = user.createJWT();

    res.status(200).json({
        success: true,
        message: 'Login Successfully',
        user,
        token,
    });
};


