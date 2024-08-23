import { Team, teamSchema } from '../model/team.model.js';
import crypto from 'crypto';
import { config } from 'dotenv';

config({ path: './.env' });

export const verifyAndSave = async (req, res) => {
  const { paymentId, orderId } = req.body;
  const signature = req.headers['signature'];

  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
                                  .update(body.toString())
                                  .digest('hex');
  if(!(signature === expectedSignature)) {
    return res.status(400).json({ message: 'Invalid Signature' });
  }
  console.log('Signature Verified');
  res.json({ success: true, message: 'Team Registered Successfully' });

  const { teamName, leaderName, email, sapId, degree, yearOfStudy, phoneNumber, alternateNumber, primeMember, selectedEvents, strength, teamMembers, transactionId, totalAmount } = req.body;
  try {
    const newPassword =  teamSchema.generatePassword(8);  

    const newTeam = new Team({ 
            teamName,
            leaderName,
            email,
            sapId,
            degree,
            yearOfStudy,
            phoneNumber,
            alternateNumber,
            primeMember,
            primeId,
            selectedEvents,
            strength,
            teamMembers,
            transactionId,
            totalAmount,
            paymentSignature: signature,
            password: newPassword
        });

        const savedTeam = await newTeam.save();
        console.log('Team Registered Successfully:', savedTeam);
  } catch(err) {
    console.error('Error while registering team:', err);
    res.status(500).json({ message: `Internal Server Error, ${err}` });
  }
}