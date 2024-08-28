import { Schema, model } from 'mongoose';

export const memberSchema = new Schema({
  name: {
    type: String,
  },
  sapId: {
    type: String,
  },
  degree: {
    type: String,
  },
  yearOfStudy: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  isPrimeMember: {
    type: String,
  },
  isUPESStudent: {
    type: String,
  },
  primeId: {
    type: String,
  }
})