const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Notification = require('../models/Notification');

// Email setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Email notification
const sendEmail = async (notification) => {
  const user = await User.findById(notification.userId);
  if (!user) throw new Error('User not found');
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: notification.title,
    text: notification.message,
    html: `<p>${notification.message}</p>`
  };
  
  await transporter.sendMail(mailOptions);
};

// SMS notification
const sendSMS = async (notification) => {
  const user = await User.findById(notification.userId);
  if (!user || !user.phone) throw new Error('User phone number not found');
  
  await twilioClient.messages.create({
    body: `${notification.title}\n${notification.message}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: user.phone
  });
};

// In-app notification (just stores in DB)
const sendInAppNotification = async (notification) => {
  // In a real app, you might trigger a websocket event here
  console.log(`In-app notification sent to user ${notification.userId}`);
};

module.exports = {
  sendEmail,
  sendSMS,
  sendInAppNotification
};