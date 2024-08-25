import Razorpay from 'razorpay';
import { config } from 'dotenv';
import { Team } from '../model/team.model.js';

config({ path: './.env' });

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

const registerUser = async (req, res) => {
    const { amount, currency, receipt } = req.body;
    const options = { amount, currency, receipt };
    try {
        const newOrder = await razorpayInstance.orders.create(options);
        if(!newOrder.status === "created") {
            return res.status(500).json({ success: false, message: 'Order not created' });
        }
        res.json(newOrder);
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal Server Error, ${error}` });
    }
};

export default registerUser;
