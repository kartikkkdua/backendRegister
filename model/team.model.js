import mongoose from 'mongoose';
import { memberSchema } from './member.model.js';
import crypto from 'crypto';

export const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    unique: true,
  },
  leaderName: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
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
  alternateNumber: {
    type: String,
  },
  isUPESStudent: {
    type: String,
  },
  isPrimeMember: {
    type: String,
  },
  primeId: {
    type: String,
    required: false,
  },
  selectedEvents: {
    type: [String],
  },
  strength: {
    type: String,
  },
  teamMembers: {
    type: [memberSchema], 
  },
  transactionId: {
    type: String,
  },
  totalAmount: {
    type: String,
  },
  paymentSignature: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String,
  },
  paymentMode: {
    type: String,
  }
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
  if (!this.salt || !this.passwordHash) return false;
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
  return this.passwordHash === hash;
}

export const Team = mongoose.model('Team', teamSchema)

// Persona personaid + teamid , pixelPerfect, Innovation, drishya - 