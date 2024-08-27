import { Schema, model } from 'mongoose';

const primeIdSchema = new Schema({
  PrimeIds: [String],
});

export const PrimeId = model('PrimeId', primeIdSchema);