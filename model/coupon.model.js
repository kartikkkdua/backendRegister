import { Schema, model } from "mongoose";

const generateUniqueCouponCode = async () => {
  const min = 1000000000000000;
  const max = 9999999999999999; 

  let couponCode;
  let existingCoupon;

  do {
    couponCode = Math.floor(Math.random() * (max - min + 1)) + min;
    existingCoupon = await Coupon.findOne({ couponCode: couponCode.toString() });
  } while (existingCoupon);

  return couponCode.toString();
};

const couponSchema = new Schema({
  name: {
    type: String,
  },
  sapId: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  couponCode: {
    type: String,
  },
  redeemed: {
    type: Boolean,
    default: false,
  },
  // add primeId after the coupon is redeemed
  primeId: {
    type: String,
  },
}, {
  timestamps: true,
});

couponSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.couponCode = await generateUniqueCouponCode();
    console.log(this.couponCode);
  }
  next();
});


export const Coupon = model("Coupon", couponSchema);