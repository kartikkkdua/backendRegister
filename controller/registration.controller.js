const NewPrimeMember = require('../models/newPrimeMember.model');
const Razorpay = require('razorpay');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/razorpay.config');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

exports.registerMember = async (req, res) => {
  try {

    const newMember = new NewPrimeMember({
      fullName: req.body.fullName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      primaryEmailId: req.body.primaryEmailId,
      phoneNumber: req.body.phoneNumber,
      sapId: req.body.sapId,
      collegeEmailId: req.body.collegeEmailId,
      course: req.body.course,
      department: req.body.department,
      degree: req.body.degree,
      graduationStartYear: req.body.graduationStartYear,
      graduationEndYear: req.body.graduationEndYear,
      graduationCurrentYear: req.body.graduationCurrentYear,
      membershipPeriod: req.body.membershipPeriod,
      agreeToCodeOfEthics: req.body.agreeToCodeOfEthics,
      membershipFee: req.body.membershipFee,
      paymentStatus: 'Pending',
    });

    const order = await razorpay.orders.create({
      amount: newMember.membershipFee * 100, // Amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};
