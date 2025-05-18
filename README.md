# Notification Service

A robust Node.js/Express service for sending Email, SMS, and In-App notifications with queue-based processing and automatic retries.

## Features 

- Email notifications (via Nodemailer)
- SMS notifications (via Twilio)
- In-app notifications
- Redis-backed queue for async processing
- Automatic retries (3 attempts)
- MongoDB storage
- REST API endpoints

## Prerequisites 

- Node.js v16+
- MongoDB (Local or Atlas)
- Redis (Local or Cloud)
- Twilio account (for SMS)
- Email service (Gmail/Mailgun/SendGrid)

## Installation 

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/notification-service.git
   cd notification-service
   ```

2.Install dependencies:
```bash
npm install
```

3. Create .env file:
   ```bash
    Database
    MONGODB_URI=mongodb://localhost:27017/notification_service
    REDIS_URL=redis://localhost:6379
    PORT=3000
    
    Email (Nodemailer)
    EMAIL_SERVICE=gmail
    EMAIL_USER=your@gmail.com
    EMAIL_PASS=your-app-password  # Use 2FA app password for Gmail
    
    SMS (Twilio)
    TWILIO_ACCOUNT_SID=your_account_sid
    TWILIO_AUTH_TOKEN=your_auth_token
    TWILIO_PHONE_NUMBER=+15005550000
    ```

### Running The Service
 ```bash
    # Start Redis (in separate terminal)
    redis-server
    
    # Start MongoDB (if using locally)
    mongod
    
    # Start the service
    npm run dev
 ```

![image](https://github.com/user-attachments/assets/e2182a1a-f237-4da9-8834-87d7e51a40e0)

![image](https://github.com/user-attachments/assets/df5f90d7-24dc-4e10-817a-8db784d543bd)


![image](https://github.com/user-attachments/assets/103fdf90-54d7-4e7a-8c16-485122c0e8c5)

![image](https://github.com/user-attachments/assets/d8494fc8-05cc-4f6e-ac81-2cb3301d7e2c)



# API DOCUMENTATION

### Base URL
    http://localhost:3000

### Endpoints
  1. Send Notification
  POST /notifications

  Request Body:

```json
{
  "userId": "string (required)",
  "type": "string (required, enum: ['email', 'sms', 'in-app'])",
  "title": "string (required)",
  "message": "string (required)",
  "metadata": "object (optional)"
}
Example Response (201 Created):

json
{
  "message": "Notification queued for sending",
  "notification": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k",
    "userId": "user123",
    "type": "email",
    "title": "Test",
    "message": "Hello World",
    "status": "pending"
  }
}
```


### 2. Get User Notifications
  GET /users/{id}/notifications
  
  Query Parameters:
  
  limit: Items per page (default: 10)
  
  page: Page number (default: 1)
  
  type: Filter by notification type
  
  Example Response (200 OK):

```json
{
  "notifications": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k",
      "type": "email",
      "title": "Test",
      "message": "Hello World",
      "status": "sent",
      "createdAt": "2023-12-01T12:34:56.789Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "hasMore": false
}
```

## Testing 
```bash
# Send test notification
curl -X POST http://localhost:3000/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "type": "email",
    "title": "Test",
    "message": "Hello World"
  }'
```

### Get notifications
```curl
  http://localhost:3000/users/user123/notifications
```

### Assumptions

- User Management:
- User records must exist before sending notifications
- Users need email for email notifications and phone for SMS

### Services:

- Twilio for SMS (paid after trial)
- Gmail for emails (500/day limit)
- Redis for queue management

### Security:

- No built-in authentication (add JWT for production)
- IP whitelisting required for MongoDB Atlas

### Deployment
#### For production deployment:
- Use MongoDB Atlas
- Use Redis Cloud
- Replace Gmail with SendGrid/Mailgun
- Add proper authentication

### Next Steps
- Add JWT authentication
- Implement WebSocket for real-time updates
- Create notification templates
- Set up monitoring dashboard

