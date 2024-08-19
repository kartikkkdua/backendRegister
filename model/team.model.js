import { Schema, model } from 'mongoose';
import { memberSchema } from './member.model';

const teamSchema = new Schema({
  leaderName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  degree: {
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
  strength: {
    type: Number,
    required: true
  },
  members: {
    type: [memberSchema],
    required: true,
    validate: {
      validator: function(members) {
        return members.length === this.strength
      }
    }
  }
})

export const Team = model('Team', teamSchema)