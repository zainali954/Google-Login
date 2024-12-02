import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import connectDB from './DB/connectDB.js'

const app = express();

console.log(process.env.FRONTEND_URL)
// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
  // Only start the server if DB connection is successful
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
  console.error('Failed to connect to DB:', error);
  process.exit(1);  // Exit the app if DB connection fails
});

// Routes
app.use('/auth', authRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({success: false, message: 'Something went wrong!' });
});
