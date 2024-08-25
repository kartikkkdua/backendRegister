import mongoose from 'mongoose';
import { memberSchema } from './member.model.js';
import crypto from 'crypto';

export const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    // required: true,
    unique: true,
  },
  leaderName: {
    type: String,
    // required: true
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    // required: true
  },
  sapId: {
    type: String,
    // required: true
  },
  degree: {
    type: String,
    // required: true
  },
  yearOfStudy: {
    type: String,
    // required: true
  },
  phoneNumber: {
    type: String,
    // required: true
  },
  alternateNumber: {
    type: String,
    // required: true
  },
  primeMember: {
    type: String,
    // required: true
  },
  primeId: {
    type: String,
    required: false,
  },
  selectedEvents: {
    type: [String],
    // required: true
  },
  strength: {
    type: String,
    // required: true
  },
  teamMembers: {
    type: [memberSchema], 
  },
  transactionId: {
    type: String,
    // required: true
  },
  totalAmount: {
    type: String,
    // required: true
  },
  paymentSignature: {
    type: String,
    // required: true
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String,
  },
  
  //teamid generate, consecutive, separate for the 4 events. 
  //save all the team ids in the main teams collection
}, {
  timestamps: true,
})

teamSchema.methods.generatePassword = function(length) {
  const password = crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return { password, salt, passwordHash };
};

teamSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
  return this.passwordHash === hash;
}

export const Team = mongoose.model('Team', teamSchema)

// Persona personaid + teamid , pixelPerfect, Innovation, drishya - 