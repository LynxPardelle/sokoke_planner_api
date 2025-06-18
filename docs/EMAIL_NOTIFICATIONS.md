# 📧 Email Notifications

The Sokoke Planner API includes a comprehensive email notification system that automatically sends relevant emails to users for various events throughout the application lifecycle.

## 🎯 Overview

The email notification system provides automated communications for:

- **User Registration**: Welcome emails with account verification
- **Password Management**: Password reset requests and change confirmations
- **Project Management**: Assignment notifications when users are added to projects
- **Task Management**: Assignment notifications when users are assigned to tasks
- **Deadline Reminders**: Automated reminders for upcoming project and task deadlines

## 🏗️ Architecture

### Core Components

1. **EmailService** (`src/shared/services/email.service.ts`)
   - Main service for sending all types of emails
   - Template-based email generation using Handlebars
   - SMTP transport configuration
   - Comprehensive error handling and logging

2. **NotificationService** (`src/shared/services/notification.service.ts`)
   - Scheduled task service for deadline reminders
   - Cron-based job scheduling
   - Integration with project and task services

3. **Email Templates**
   - HTML templates with variable substitution
   - Consistent branding and styling
   - Responsive design for all email clients

### Service Integration

The email system is integrated throughout the application:

- **AuthService**: Sends welcome and password-related emails
- **ProjectService**: Sends project assignment notifications
- **TaskService**: Sends task assignment notifications
- **NotificationService**: Sends scheduled deadline reminders

## 📋 Email Types

### 1. Welcome Email
**Trigger**: User registration
**Recipients**: New user
**Content**: 
- Welcome message
- Account verification link
- Getting started information

### 2. Password Reset Email
**Trigger**: Password reset request
**Recipients**: User requesting reset
**Content**:
- Password reset link (expires in 1 hour)
- Security information
- Instructions for completing reset

### 3. Password Changed Notification
**Trigger**: Successful password change
**Recipients**: Account owner
**Content**:
- Change confirmation
- Timestamp and IP address
- Security notice if change was unauthorized

### 4. Project Assignment Notification
**Trigger**: User added to project (create/update)
**Recipients**: Newly assigned users
**Content**:
- Project name and description
- Assignment details
- Due date information
- Direct link to project

### 5. Task Assignment Notification
**Trigger**: User assigned to task (create/update)
**Recipients**: Newly assigned users
**Content**:
- Task name and description
- Project context
- Priority and due date
- Direct link to task

### 6. Task Deadline Reminder
**Trigger**: Scheduled cron job (daily at 9 AM)
**Recipients**: Users with tasks due within 3 days
**Content**:
- Task details
- Days until deadline
- Priority indicator
- Action required

### 7. Project Deadline Reminder
**Trigger**: Scheduled cron job (daily at 9 AM)
**Recipients**: Project owners with projects due within 7 days
**Content**:
- Project details
- Days until deadline
- Current status
- Action required

## ⚙️ Configuration

### Environment Variables

```bash
# SMTP Server Configuration
SMTP_HOST=smtp.gmail.com          # SMTP server hostname
SMTP_PORT=587                     # SMTP server port
SMTP_SECURE=false                 # Use TLS (true for port 465)
SMTP_USER=your-email@gmail.com    # SMTP authentication username
SMTP_PASS=your-app-password       # SMTP authentication password

# Email Branding
EMAIL_FROM="Sokoke Planner <noreply@sokoke-planner.com>"

# Application URLs
APP_URL=http://localhost:3000      # Backend API URL
FRONTEND_URL=http://localhost:3001 # Frontend application URL
```

### Provider-Specific Setup

#### Gmail
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use app password in `SMTP_PASS`

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### SendGrid (Production Recommended)
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 🔧 Template System

### Template Structure

Templates are defined in the `EmailService.loadEmailTemplates()` method:

```typescript
{
  subject: "Email Subject with {{variables}}",
  html: "HTML content with {{variables}}",
  text: "Plain text fallback" // optional
}
```

### Available Variables

#### User Context
- `{{name}}` - User's display name
- `{{email}}` - User's email address

#### Authentication Context
- `{{resetUrl}}` - Password reset URL
- `{{verificationUrl}}` - Account verification URL
- `{{changeDate}}` - Password change timestamp
- `{{ipAddress}}` - Request IP address
- `{{userAgent}}` - Browser/client information

#### Project Context
- `{{projectName}}` - Project title
- `{{projectDescription}}` - Project description
- `{{projectUrl}}` - Direct link to project
- `{{assignedBy}}` - User who made the assignment
- `{{dueDate}}` - Project due date

#### Task Context
- `{{taskName}}` - Task title
- `{{taskDescription}}` - Task description
- `{{taskUrl}}` - Direct link to task
- `{{priority}}` - Task priority level
- `{{dueStatus}}` - Days until due (e.g., "in 2 days")

## 🚀 Usage Examples

### Sending Custom Emails

```typescript
// Inject EmailService
constructor(private emailService: EmailService) {}

// Send custom email
await this.emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<h1>Custom HTML Content</h1>',
  text: 'Custom text content',
});

// Send template-based email
await this.emailService.sendEmail({
  to: 'user@example.com',
  template: 'welcome',
  context: {
    name: 'John Doe',
    verificationUrl: 'https://app.com/verify/token123',
  },
});
```

### Testing Email Configuration

```typescript
// Test SMTP connection
const isConnected = await this.emailService.testConnection();
console.log('Email service status:', isConnected ? 'Connected' : 'Failed');
```

## 📅 Scheduled Notifications

### Deadline Reminders

The `NotificationService` runs scheduled jobs to send deadline reminders:

```typescript
// Task reminders - Daily at 9:00 AM
@Cron(CronExpression.EVERY_DAY_AT_9AM)
async sendTaskDeadlineReminders()

// Project reminders - Daily at 9:00 AM  
@Cron(CronExpression.EVERY_DAY_AT_9AM)
async sendProjectDeadlineReminders()
```

### Customizing Schedule

Modify the cron expressions in `NotificationService`:

```typescript
// Every hour
@Cron(CronExpression.EVERY_HOUR)

// Every Monday at 8 AM
@Cron('0 8 * * 1')

// Custom expression
@Cron('0 9 * * 1-5') // Weekdays at 9 AM
```

## 🛠️ Development

### Adding New Email Types

1. **Define Template** in `EmailService.loadEmailTemplates()`:
```typescript
this.templates.set('new-email-type', {
  subject: 'New Email Subject',
  html: `<h1>Hello {{name}}</h1>`,
});
```

2. **Create Service Method**:
```typescript
async sendNewEmailType(
  userEmail: string,
  userName: string,
  customData: string
): Promise<boolean> {
  return this.sendEmail({
    to: userEmail,
    template: 'new-email-type',
    context: {
      name: userName,
      customData,
    },
  });
}
```

3. **Integrate in Business Logic**:
```typescript
// In your service
await this.emailService.sendNewEmailType(
  user.email,
  user.name,
  'custom data'
);
```

### Testing Emails

1. **Use a Test SMTP Service** (MailHog, Ethereal Email)
2. **Override Email Service** in tests
3. **Use Email Preview Tools** for template development

## 🔍 Monitoring and Logging

### Email Logs

All email operations are logged with:
- Recipient information
- Email type/template
- Success/failure status
- Error details (if any)

### Error Handling

The email system includes comprehensive error handling:
- SMTP connection failures
- Template rendering errors
- Invalid recipient addresses
- Rate limiting and retry logic

### Monitoring Recommendations

1. **Track Email Delivery Rates**
2. **Monitor SMTP Connection Health**
3. **Alert on Failed Email Batches**
4. **Review Bounce and Complaint Rates**

## 🚫 Troubleshooting

### Common Issues

#### Connection Refused
```
Error: Connection refused
```
**Solution**: Check SMTP host and port settings

#### Authentication Failed
```
Error: Invalid login
```
**Solution**: Verify SMTP username and password/app password

#### Template Not Found
```
Error: Template 'xyz' not found
```
**Solution**: Ensure template is defined in `loadEmailTemplates()`

#### High Memory Usage
```
Warning: High memory usage in email service
```
**Solution**: Implement email queuing for high-volume scenarios

### Debug Mode

Enable detailed logging:
```bash
LOGGER_LEVEL=debug
```

### Testing SMTP Connection

```bash
# Test from command line
npm run test:email-connection
```

## 📈 Performance Considerations

### Production Optimizations

1. **Use Professional SMTP Service** (SendGrid, AWS SES, Mailgun)
2. **Implement Email Queuing** for high-volume scenarios
3. **Add Rate Limiting** to prevent spam
4. **Monitor Delivery Metrics**
5. **Implement Email Templates Caching**

### Scaling Recommendations

- Use dedicated email service providers for production
- Implement email queuing with Redis/Bull
- Add circuit breakers for SMTP failures
- Consider email batching for bulk notifications

## 🔒 Security Best Practices

1. **Use App Passwords** instead of account passwords
2. **Enable TLS/SSL** for SMTP connections
3. **Validate Email Addresses** before sending
4. **Implement Rate Limiting** to prevent abuse
5. **Log Security Events** (failed authentications, etc.)
6. **Use Environment Variables** for sensitive configuration
7. **Implement Unsubscribe Mechanisms** for marketing emails

## 📝 Notes

- Emails are sent asynchronously to avoid blocking application operations
- Failed email deliveries are logged but don't cause application failures
- Template rendering errors are caught and logged with details
- SMTP connection is verified on service initialization
- Deadline reminders run in background without blocking the main application

---

For additional support or questions about email notifications, please refer to the [Developer Guide](./DEVELOPER_GUIDE.md) or [API Reference](./API_REFERENCE.md).
