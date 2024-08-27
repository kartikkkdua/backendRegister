import { Schema, model } from 'mongoose';

const primeIdSchema = new Schema({
  primeId: {
    type: String,
  },
});

export const PrimeId = model('PrimeId', primeIdSchema);