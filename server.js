import express, { urlencoded, json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { connectDB } from './database.js';
import paymentRoute from './routes/payment.routes.js';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import verifyPaymentAndSaveRoute from './routes/verifyPaymentAndSave.routes.js'

const app = express();

// Environment Variables
config({ path: './.env' });

// Connect to the database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Set a default if CORS_ORIGIN isn't defined
  credentials: true,
}));

app.use(urlencoded({
  extended: true,
}));

app.use(json());

// Start AdminJS
const admin = new AdminJS({
  resources: [],
  rootPath: '/admin',
})

const adminRouter = AdminJSExpress.buildRouter(admin)
app.use(admin.options.rootPath, adminRouter)

// Routes
app.use('/api/v1', paymentRoute);
app.use('/api/v1', verifyPaymentAndSaveRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
})