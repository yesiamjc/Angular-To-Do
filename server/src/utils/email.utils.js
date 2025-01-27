import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendCompletionEmail = async (task) => {
  // Verify environment variables are loaded
  if (!process.env.MY_EMAIL || !process.env.MY_MAIL_PASS || !process.env.ADMIN_EMAIL) {
    throw new Error('Required email configuration is missing in environment variables');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      // If using Gmail, this should be an App Password, not your regular password
      pass: process.env.MY_MAIL_PASS
    },
    secure: true
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: 'Task Completed Notification',
    text: `The task "${task.myTask}" has been completed by the user with email: ${task.userEmail}`,
    // Adding HTML version for better formatting
    html: `
      <h2>Task Completion Notification</h2>
      <p>Task: <strong>${task.myTask}</strong></p>
      <p>Completed by: ${task.userEmail}</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error; // Re-throw to handle in the controller
  }
};