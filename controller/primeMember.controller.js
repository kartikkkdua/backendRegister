const Razorpay = require('razorpay');
const crypto = require('crypto');
const NewPrimeMember = require('../models/newPrimeMember.model');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.initiatePayment = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, primaryEmailId, phoneNumber, sapId, collegeEmailId, course, department, degree, graduationStartYear, graduationEndYear, graduationCurrentYear, membershipPeriod, membershipFee } = req.body;

    const paymentOptions = {
      amount: membershipFee * 100, 
      currency: 'INR',
      receipt: `${sapId}-${Date.now()}`, 
      payment_capture: 1,
    };

    const payment = await razorpayInstance.orders.create(paymentOptions);

    res.status(200).json({ payment, userData: req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

exports.verifyPaymentAndRegisterMember = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userData } = req.body;

  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      const newMember = new NewPrimeMember({
        ...userData,
        paymentStatus: 'Completed',
        transactionId: razorpay_payment_id,
      });

      await newMember.save();
      res.status(201).json({ message: 'Payment successful and member registered', newMember });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
