import { Schema, model } from 'mongoose';

export const memberSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  sapId: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  yearOfStudy: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
})