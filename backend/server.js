import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDb } from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import aiRoutes from "./routes/aiRoutes.js";

const app = express(); // ✅ must come before using routes
const port = 4000;

// Connect to MongoDB
connectMongoDb("mongodb://localhost:27017/E-commerceProject")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ Error connecting to MongoDB", err));

// Connect to Cloudinary
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/product', aiRoutes); // ✅ AI Routes mounted here
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send("API Working ✅");
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Webserver started on port: ${port}`);
});
