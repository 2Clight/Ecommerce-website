import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },

    cartItems: [{
        quantity: {
            type: Number,
            default: 1
        },
        product: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the Product model instead of a getting the product details
            ref: 'Product'
        }
    }],

    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
}, { timestamps: true }); //creates createdAt and updatedAt fields



//hashing password before saving to database using bcrypt.js

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); //a callback to indicate that the middleware is done and to proceed to the next middleware in the stack
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); //with no arguments indicates success, and saves the document
    }
    catch (err) {
        next(err); //with an error argument indicates failure, and aborts the save operation
    }
}); 


//method to compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//placed last because it is the final step in the model definition
const User= mongoose.model("User", userSchema);



export default User;