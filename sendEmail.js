import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config({ path: './.env' });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: process.env.EMAIL_PORT, 
  secure: process.env.EMAIL_PORT == 465, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to,
    subject, 
    html: htmlContent, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred while sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};