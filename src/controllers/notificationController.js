const Notification = require('../models/Notification');
const notificationQueue = require('../queues/notificationQueue');

// Send notification
exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, title, message, metadata } = req.body;
    
    // Validate input
    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create notification in database
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      metadata: metadata || {},
      status: 'pending'
    });
    
    // Add to queue for processing
    await notificationQueue.add({
      notificationId: notification._id
    });
    
    res.status(201).json({
      message: 'Notification queued for sending',
      notification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, page = 1, type } = req.query;
    
    const query = { userId: id };
    if (type) query.type = type;
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    
    res.json({
      notifications,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: (parseInt(page) * parseInt(limit)) < total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};