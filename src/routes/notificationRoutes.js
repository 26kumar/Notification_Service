const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /notifications - Send a notification
router.post('/', notificationController.sendNotification);

module.exports = router;