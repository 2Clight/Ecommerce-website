import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'; 
import productRoutes from './routes/product.route.js'; 
import cartRoutes from './routes/cart.route.js'; 
import couponRoutes from './routes/cupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // replace with your frontend URL
    credentials: true
}));



const PORT = process.env.PORT || 5000;

app.use(express.json()); //middleware to parse JSON request bodies
app.use(cookieParser()); //middleware to parse cookies
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Global error handling middleware



app.listen(PORT, () => {
    console.log("Server is running http://localhost:" + PORT);

    connectDB();
});