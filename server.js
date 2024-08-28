import express, { urlencoded, json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { connectDB } from './database.js';
import paymentRoute from './routes/payment.routes.js';
import verifyPaymentAndSaveRoute from './routes/verifyPaymentAndSave.routes.js';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Resource, Database } from '@adminjs/mongoose'; // Correct import
import { Team } from './model/team.model.js';
import { ArenaEvent, DrishyaEvent, InnovationEvent, PersonaEvent } from './model/event.model.js';
import checkTeamName from "./routes/checkTeamName.routes.js";
import checkPrimeId from "./routes/checkPrimeId.routes.js";
import findTeams from './routes/findTeams.routes.js';
import cashPayment from './routes/cashPayment.routes.js';

const app = express();

// Environment Variables
config({ path: './.env' });

// Connect to the database
connectDB();


// Register Mongoose adapter for AdminJS
AdminJS.registerAdapter({ Resource, Database }); // Use correct imports

// Initialize AdminJS
const admin = new AdminJS({
  resources: [Team, InnovationEvent, DrishyaEvent, ArenaEvent, PersonaEvent],
  rootPath: '/admin',
});

// Admin credentials
const ADMIN = {
  email: process.env.ADMIN_EMAIL, // Use your admin email
  password: process.env.ADMIN_PASSWORD,    // Use your admin password
};

// Setup authentication for AdminJS
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookiePassword: process.env.COOKIE_SECRET || 'sessionKeyPassword', // Secure password
});

app.use(admin.options.rootPath, adminRouter);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Set a default if CORS_ORIGIN isn't defined
  credentials: true,
}));

app.use(urlencoded({ extended: true }));
app.use(json());


// API routes
app.use('/api/v1', paymentRoute);
app.use('/api/v1', verifyPaymentAndSaveRoute);
app.use('/api/v1', checkTeamName);
app.use('/api/v1', checkPrimeId);
app.use('/api/v1', findTeams);
app.use('/api/v1', cashPayment);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
