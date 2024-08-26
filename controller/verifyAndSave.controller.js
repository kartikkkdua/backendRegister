import { Team, teamSchema } from '../model/team.model.js';
import crypto from 'crypto';
import { sendEmail } from '../sendEmail.js'
import { config } from 'dotenv';
import { generateHexCode } from '../generatePassword.js';
import { Counter } from '../model/counter.model.js';
import { DrishyaEvent, PersonaEvent, ArenaEvent, InnovationEvent } from '../model/event.model.js';

config({ path: './.env' });

export const verifyAndSave = async (req, res) => {
  const { paymentId, orderId } = req.body;
  const signature = req.headers['signature'];

  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest('hex');
  if (!(signature === expectedSignature)) {
    return res.status(400).json({ message: 'Invalid Signature' });
  }

  console.log('Signature Verified');

  const { teamName, leaderName, email, sapId, degree, yearOfStudy, phoneNumber, alternateNumber, primeMember, selectedEvents, strength, teamMembers, transactionId, totalAmount } = req.body;

  try {

    //generate 4 event ids


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
      selectedEvents,
      strength,
      teamMembers,
      transactionId,
      totalAmount,
      paymentSignature: signature,
    });

    const { password, passwordHash, salt } = newTeam.generatePassword(8);
    newTeam.passwordHash = passwordHash;
    newTeam.salt = salt;

    const savedTeam = await newTeam.save();

    if (!savedTeam) {
      return res.status(500).json({ success: false, message: 'Error while registering team to the database' });
    }

    for (const event of selectedEvents) {
      let counter, eventId;

      switch (event) {
        case 'Drishय':
          counter = await Counter.findOneAndUpdate(
            { eventType: 'drishya' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
          );

          // Generate the event ID for DrishyaEvent
          eventId = `Drishya${counter.count}`;

          // Create a new document in DrishyaEvent model
          const drishyaEvent = new DrishyaEvent({
            drishyaId: eventId,
            teamId: newTeam._id, // Reference to the newly created team
          });

          await drishyaEvent.save();
          break;

        case 'ARENA 3.0':
          counter = await Counter.findOneAndUpdate(
            { eventType: 'arena' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
          );

          // Generate the event ID for ArenaEvent
          eventId = `Arena${counter.count}`;

          // Create a new document in ArenaEvent model
          const arenaEvent = new ArenaEvent({
            arenaId: eventId,
            teamId: newTeam._id,
          });

          await arenaEvent.save();
          break;

        case 'INNOVAक्षण':
          counter = await Counter.findOneAndUpdate(
            { eventType: 'innovation' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
          );

          // Generate the event ID for InnovationEvent
          eventId = `Inno${counter.count}`;

          // Create a new document in InnovationEvent model
          const innovationEvent = new InnovationEvent({
            innovationId: eventId,
            teamId: newTeam._id,
          });

          await innovationEvent.save();
          break;

        case 'PERSONA':
          counter = await Counter.findOneAndUpdate(
            { eventType: 'persona' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
          );

          // Generate the event ID for PersonaEvent
          eventId = `Persona${counter.count}`;

          // Create a new document in PersonaEvent model
          const personaEvent = new PersonaEvent({
            personaId: eventId,
            teamId: newTeam._id,
          });

          await personaEvent.save();
          break;

        default:
          console.warn(`Unknown event type: ${event}`);
          break;
      }
    }

    console.log('Team Registered Successfully:', savedTeam);

    // Generate a token after successful registration
    const token = generateHexCode(transactionId, process.env.PROTECTED_ROUTE_SECRET)

    // Sending Email after successful team registration
    const emailSubject = 'Payment Successful and Team Registration Confirmation';
    const emailText = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px; background-color: #ffffff;">
    <div style="background-color: #28a745; color: #ffffff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="font-size: 24px; margin: 0; font-weight: 600;">Registration Confirmed!</h1>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333333;">Hello <strong>${leaderName}</strong>,</p>
      <p style="font-size: 16px; color: #333333;">Congratulations! Your team, <strong>${teamName}</strong>, has been successfully registered for the upcoming event.</p>
  
      <h3 style="color: #28a745; font-size: 18px; margin-top: 30px;">Your Registration Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Leader Name:</strong></td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${leaderName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Email:</strong></td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${email}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Team Members:</strong></td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${teamMembers.map((item) => {
            return `<strong>${item.name}</strong> (${item.sapId})`
          }).join(', ')}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Selected Events:</strong></td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${selectedEvents.join(', ')}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Transaction ID:</strong></td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${transactionId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Total Amount Paid:</strong></td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;">${totalAmount}</td>
        </tr>
        
        <tr>
          <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Team Password:</strong></td>
          <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>${password}</strong></td>
        </tr>
      </table>
  
      <p style="font-size: 16px; color: #333333; margin-top: 30px;">Please keep this email safe for your reference. We look forward to an amazing event experience together!</p>
  
      <p style="font-size: 16px; color: #333333; margin-top: 20px;">Best regards,<br><strong>Team UPES-CSI</strong></p>
    </div>
    <div style="background-color: #f7f7f7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #888888;">
      <p style="font-size: 14px; margin: 0;">For any queries, reach out to us at <a href="mailto:yugmak3.0@upescsi.in" style="color: #28a745; text-decoration: none;">yugmak3.0@upescsi.in</a>.</p>
      <p style="font-size: 14px; margin: 10px 0 0;">Copyright 2024 &copy; UPES-CSI</p
    </div>
  </div>
  
    `;

    sendEmail(email, emailSubject, emailText);

    res.json({ success: true, message: 'Team Registered Successfully', token });

  } catch (err) {
    console.error('Error while registering team:', err);
    res.status(500).json({ success: false, message: `Internal Server Error, ${err}` });
  }
}
