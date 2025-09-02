import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getRecommendedProducts, getProductsByCategory, toggleFeaturedProducts } from '../controllers/product.controller.js'; 
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('/featured',  getFeaturedProducts);
router.get('/category/:category',  getProductsByCategory);
router.get('/recommendation',  getRecommendedProducts);
router.post('/', protectRoute, adminRoute, createProduct);
router.patch('/', protectRoute, adminRoute, toggleFeaturedProducts);
router.delete('/:id', protectRoute, adminRoute, deleteProduct); //we use delete because we want to remove a product

export default router;