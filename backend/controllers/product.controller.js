import Product from '../models/product.model.js';
import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); //the use of {} is to find all products
        res.status(200).json(products);
    } catch (error) {
        console.log("error in getallproducts controller", error.message);
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {

        const featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        //if not in redis fetch from mongodb
        featuredProducts = await Product.find({ isFeatured: true }).lean(); //we use lean is going to return a plain javascript object instead of a mongodb document

        if (!featuredProducts) {
            return res.status(404).json({ message: 'No featured products found' });
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts)); //used to cache the featured products

        res.json(featuredProducts);//to return the featured products
    } catch (error) {
        console.log("error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: 'Error fetching featured products', error });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });

        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.log("error in createProduct controller", error.message);
        res.status(500).json({ message: 'Error creating product', error });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; //this will get the id of the image
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log('deleted image from cloudinary')
            } catch (error) {
                console.log("error in deleteProduct controller", error.message);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(204).send();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log("error in deleteProduct controller", error.message);
        res.status(500).json({ message: 'Error deleting product', error });
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        //we use aggregation to get random products, aggregate is a function that processes data records and returns computed results
        const products = await Product.aggregate([
            {
                $sample: { size: 3 } //this will return 3 random products from the collection
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])
        res.status(200).json(products);
    } catch (error) {
        console.log("error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: 'Error fetching recommended products', error });
    }

}

export const getProductsByCategory = async (req, res) => {

    const { category } = req.params; //category is an object, used to get products by category
    try {
        const products = await Product.find({ category });
        res.status(200).json(products);
    } catch (error) {
        console.log("error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: 'Error fetching products by category', error });
    }

}

export const toggleFeaturedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured; // Toggle featured status
            const updatedProduct = await product.save();
            await updateFeatureProductCache();
            res.status(200).json({ message: 'Product featured status updated', product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.log("error in toggleFeaturedProducts controller", error.message);
        res.status(500).json({ message: 'Error toggling featured status', error });
    }
}

async function updateFeatureProductCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean(); //used to get a plain JavaScript object, returns all the isFeatured products that are set to true
        await redisClient.set('featuredProducts', JSON.stringify(featuredProducts));//uses redis to cache the featured products, we cache the featured products because they are frequently accessed
    } catch (error) {
        console.log("error in updateFeatureProductCache", error.message);
    }
}