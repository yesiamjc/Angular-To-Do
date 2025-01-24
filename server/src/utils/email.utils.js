import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_MAIL_PASS
  },
  secure: true,
  requireTLS: true
});

export const sendCompletionEmail = async (task) => {

  console.log(process.env.MY_EMAIL, process.env.MY_MAIL_PASS, process.env.ADMIN_EMAIL)
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: 'Task Completed Notification',
    text: `The task "${task.title}" has been completed by the user with email: ${task.userEmail}`
  };

  await transporter.sendMail(mailOptions);
  console.log('Completion email sent successfully');
};
