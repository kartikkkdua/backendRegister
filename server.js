import express, { urlencoded, json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { connectDB } from './database.js';
import registerRoute from './routes/register.routes.js';

const app = express();

//Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(urlencoded({
  extended: true,
  limit: '20kb',
}))

app.use(json())

config({ path: './.env' })

// connectDB()

//Routes
app.use('/api/v1/register', registerRoute)


//Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})