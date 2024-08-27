import { Schema, model } from "mongoose";

const couponSchema = new Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  redeemed: {
    type: Boolean,
    default: false,
  },
  // add primeId after the coupon is redeemed
  primeId: {
    type: String,
  },
});