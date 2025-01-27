
import User from "../models/usermodel.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message:'User not found. Please ensure the ID is correct.'  });
        }

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 

export const updateUser = async (req, res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!user)
            return res.status(404).json({message: 'User not found'})
        res.status(200).json({user})
        //only user or admin can update
        if (user._id.toString() !== req.params.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }

        if (req.body.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exist' });
            }
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const deleteUser = async (req, res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user)
            return res.status(404).json({message: 'User not found'})
        //only user or admin can delete
        if (user._id.toString() !== req.params.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this user' });
        }
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

export const getAllUser = async (req, res)=>{
    try {
        const users = await User.find({})
        if(!users)
            return res.status(404).json({message: 'User not found'})
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};
