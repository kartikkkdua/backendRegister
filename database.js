import { connect } from 'mongoose'
import { config } from 'dotenv'
import { initializeCounters } from './model/counter.model.js';

config({ path: './.env' })

const DB_NAME = process.env.DB_NAME  || 'test';

export const connectDB = async() => {
  try {
    const res = await connect(`${process.env.MONGO_URL}/${DB_NAME}`)
    console.log(`Mongo Connected: ${res.connection.host}`)
    const counters = await initializeCounters()
    console.log(`Counters initialized: ${counters}`)
  } catch(err) {
    console.log(`MongoDb Error: ${err}`)
    process.exit(1)
  }
}