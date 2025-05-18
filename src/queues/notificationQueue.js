const Queue = require('bull');
const Notification = require('../models/Notification');
const { sendEmail, sendSMS, sendInAppNotification } = require('../services/notificationService');

const notificationQueue = new Queue('notificationQueue', process.env.REDIS_URL);

// Process jobs
notificationQueue.process(async (job) => {
  const { notificationId } = job.data;
  
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error('Notification not found');
    
    // Send notification based on type
    switch (notification.type) {
      case 'email':
        await sendEmail(notification);
        break;
      case 'sms':
        await sendSMS(notification);
        break;
      case 'in-app':
        await sendInAppNotification(notification);
        break;
      default:
        throw new Error('Invalid notification type');
    }
    
    // Update notification status
    notification.status = 'sent';
    await notification.save();
    
    return { success: true };
  } catch (error) {
    // Update notification with failure
    const notification = await Notification.findById(notificationId);
    if (notification) {
      notification.attempts += 1;
      if (notification.attempts >= 3) {
        notification.status = 'failed';
      }
      await notification.save();
    }
    
    // Retry the job if attempts < 3
    if (job.attemptsMade < 3) {
      throw error; // Bull will automatically retry
    }
    return { success: false, error: error.message };
  }
});

module.exports = notificationQueue;