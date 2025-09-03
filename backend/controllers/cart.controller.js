import Product from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({_id:{$in:req.user.cartItems}}); // Fetch all products from the database that are in the user's cart
        //$in is a mongoDb operator that checks if a value exists in an array
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id=== product.id);
            return {
                ...product.toJSON(),
                quantity: item ? item.quantity : 0
            };
        });

        res.json(cartItems);
    } catch (error) {
        console.error("error in getCartProducts:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const addToCart = async (req, res) => {
    try {
        // Logic to add the product to the cart
        const { productId } = req.body;
        const user = req.user; //since it is a protected route we have to get the user from the request and not from the database

        const existingItem = user.cartItems.find(item => item.id === productId); // Check if the item is already in the cart
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // If the item doesn't exist, add it to the cart
            user.cartItems.push(productId);
        }

        await user.save(); // Save the updated user document
        res.status(200).json(user.cartItems, { message: 'Product added to cart successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item.id !== productId); // to remove specific item, all who dont have the productId specified will be kept to create the new array
        }

        await user.save();
        res.json(user.cartItems);
        res.status(200).json({ message: 'All items removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params; // product id, renamed it using destructuring 
        const { quantity } = req.body; // new quantity from request body
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.id === productId);

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item => item.id !== productId);//removes item if quantity is set to 0
                await user.save();
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }

    } catch (error) {
        console.error("error in updateQuantity:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
