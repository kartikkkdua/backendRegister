import { Schema, model } from 'mongoose';
import { memberSchema } from './member.model.js';

export const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
  },
  leaderName: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
  email: {
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
  alternateNumber: {
    type: String,
    required: true
  },
  primeMember: {
    type: String,
    enum: ['Yes', 'No'],
    required: true
  },
  primeId: {
    type: String,
    required: false,
  },
  selectedEvents: {
    type: [String],
    required: true
  },
  strength: {
    type: String,
    required: true
  },
  teamMembers: {
    type: [memberSchema], 
  },
  transactionId: {
    type: String,
    required: true
  },
  totalAmount: {
    type: String,
    required: true
  },
  paymentSignature: {
    type: String,
    required: true
  },
  //teamid generate, consecutive, separate for the 4 events. 
  //save all the team ids in the main teams collection
}, {
  timestamps: true
})

teamSchema.methods.generatePassword = function(length) {
  const buffer = randomBytes(length);
  const base64String = buffer.toString('base64');
  return base64String.replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
}

export const Team = model('Team', teamSchema)