const mongoose = require('mongoose');
const { Coupon } = require('./coupon.model');

const newPrimeMemberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  primaryEmailId: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  sapId: {
    type: String,
    required: true,
  },
  collegeEmailId: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  graduationStartYear: {
    type: Number,
    required: true,
  },
  graduationEndYear: {
    type: Number,
    required: true,
  },
  graduationCurrentYear: {
    type: Number,
    required: true,
  },
  membershipPeriod: {
    type: Number,
    required: true,
  },
  agreeToCodeOfEthics: {
    type: Boolean,
    required: true,
  },
  membershipFee: {
    type: Number,
    required: true,
  },
  coupon:{
    type: String,
    required: false,
  },
  transactionId: {
    type: String,
    required: false,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

const NewPrimeMember = mongoose.model('NewPrimeMember', newPrimeMemberSchema);

module.exports = NewPrimeMember;
