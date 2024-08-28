import { Team } from '../model/team.model.js';
import crypto from 'crypto';
import { sendEmail } from '../sendEmail.js'
import { config } from 'dotenv';
import { generateHexCode } from '../generatePassword.js';
import { Counter } from '../model/counter.model.js';
import { DrishyaEvent, PersonaEvent, ArenaEvent, InnovationEvent, ValorantEvent } from '../model/event.model.js';
import { Coupon } from '../model/coupon.model.js';

config({ path: './.env' });

export const cashPayment = async (req, res) => {
  const { teamName, leaderName, email, sapId, degree, yearOfStudy, phoneNumber, alternateNumber, isPrimeMember,
    isUPESStudent, primeId, selectedEvents, strength, teamMembers, transactionId, totalAmount } = req.body;

  // Send coupon to non-prime members
  const notPrimeMembers = [];
  teamMembers.forEach((member) => {
    if (!member.isPrimeMember) {
      notPrimeMembers.push({ name: member.name, sapId: member.sapId, email: member.email, phoneNumber: member.phoneNumber });
    }
  })
  if (!isPrimeMember) {
    notPrimeMembers.push({ name: leaderName, sapId, email, phoneNumber });
  }
  try {
    for (const member of notPrimeMembers) {
      const coupon = new Coupon({
        name: member.name,
        sapId: member.sapId,
        email: member.email,
        phoneNumber: member.phoneNumber,
      });

      const newCoupon = await coupon.save();
      console.log('Coupon Generated:', newCoupon);
      const couponEmailSubject = 'Your Exclusive Discount Coupon for UPES-CSI Chapter Fair!';
      const couponEmailText = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px; background-color: #ffffff;">
    <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="font-size: 24px; margin: 0; font-weight: 600;">Congratulations!</h1>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333333;">Hello <strong>${member.name}</strong>,</p>
      <p style="font-size: 16px; color: #333333;">Congratulations! You have been successfully registered for <strong>YUGMAK 3.0</strong> for the events: ${selectedEvents.join(', ')}.</p>
      <p style="font-size: 16px; color: #333333;">Since you are not a prime member, you have won a special discount coupon for our upcoming Chapter Fair on 31st August.</p>
      
      <div style="margin-top: 20px; text-align: center;">
        <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 0;">Your Discount Coupon Code:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 5px 0 0;">${newCoupon.couponCode}</p>
      </div>

      <h3 style="color: #007bff; font-size: 18px; margin-top: 30px;">Steps to Use Your Coupon:</h3>
      <ul style="font-size: 16px; color: #333333; line-height: 1.6; list-style-type: disc; padding-left: 20px;">
        <li>Register for the UPES-CSI Student Chapter during the fair.</li>
        <li>After filling in your details in the registration form, enter your coupon code in the designated textbox before proceeding to payment.</li>
      </ul>

      <p style="font-size: 16px; color: #333333; margin-top: 30px;">If you have any questions or need further assistance, feel free to reach out to us at <a href="mailto:yugmak3.0@upescsi.in" style="color: #007bff; text-decoration: none;">yugmak3.0@upescsi.in</a>.</p>

      <p style="font-size: 16px; color: #333333; margin-top: 20px;">Looking forward to seeing you at the fair!</p>

      <p style="font-size: 16px; color: #333333; margin-top: 20px;">Best regards,<br><strong>Team UPES-CSI</strong></p>
    </div>
    <div style="background-color: #f7f7f7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #888888;">
      <p style="font-size: 14px; margin: 0;">For any queries, reach out to us at <a href="mailto:yugmak3.0@upescsi.in" style="color: #007bff; text-decoration: none;">yugmak3.0@upescsi.in</a>.</p>
      <p style="font-size: 14px; margin: 10px 0 0;">Copyright 2024 &copy; UPES-CSI</p>
    </div>
  </div>
`;
      sendEmail(member.email, couponEmailSubject, couponEmailText);
    }
  } catch (err) {
    console.error('Error while sending coupons:', err);
    return res.status(500).json({ success: false, message: `Internal Server Error`})
  }

  try {
    // Save the team to the database
    const newTeam = new Team({
      teamName,
      leaderName,
      email,
      sapId,
      degree,
      yearOfStudy,
      phoneNumber,
      alternateNumber,
      isPrimeMember,
      primeId,
      selectedEvents,
      strength,
      isUPESStudent,
      teamMembers,
      totalAmount,
      paymentMode: 'Cash',
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

          case 'Valorant':
            counter = await Counter.findOneAndUpdate(
              { eventType: 'valorant' },
              { $inc: { count: 1 } },
              { new: true, upsert: true }
            );
      
            // Generate the event ID for ValorantEvent
            eventId = `Valorant${counter.count}`;
      
            // Create a new document in ValorantEvent model
            const valorantEvent = new ValorantEvent({
              valorantId: eventId,
              teamId: newTeam._id,
            });
      
            await valorantEvent.save();
            break;

        default:
          console.warn(`Unknown event type: ${event}`);
          break;
      }
    }

    console.log('Team Registered Successfully:', savedTeam);


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

    res.json({ success: true, message: 'Team Registered Successfully' });

  } catch (err) {
    console.error('Error while registering team:', err);
    res.status(500).json({ success: false, message: `Internal Server Error, ${err}` });
  }
}