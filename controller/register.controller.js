import Razorpay from 'razorpay';
import { config } from 'dotenv';

config({ path: './.env' })

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

const registerUser = async(req,res)=>{
    try {
        const amount = req.body.amount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: ''
        }

        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).json({
                        success:true,
                        msg:'Team Registered Successfully',
                        order_id:order.id,
                        amount:amount,
                        key_id:process.env.RAZORPAY_ID_KEY,
                        product_name:req.body.name,
                        description:req.body.description,

                    });
                }
                else{
                    res.status(400).json({success:false,msg:'Something went wrong!'});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}


export default registerUser;