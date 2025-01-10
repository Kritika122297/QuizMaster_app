import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import JWT from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: true, // Ensure password is included in queries
    },
    Quizzez: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
    }],
    role: {
        type: String,
        enum: ['admin', 'creator', 'user'],
        default: 'user',
    },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return; // Only hash if password is modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
}); 

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (userPassword) {
    
    
    return await bcrypt.compare(userPassword, this.password); // Compare using instance's password
};

// Instance method to create JWT
userSchema.methods.createJWT = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};


export default mongoose.model('User', userSchema);
