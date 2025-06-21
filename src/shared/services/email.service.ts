import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { LoggerService } from './logger.service';
import { TEmailOptions, TEmailTemplate } from '../types/email.type';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private templates: Map<string, TEmailTemplate> = new Map();

  constructor(
    private readonly _configService: ConfigService,
    private readonly _loggerService: LoggerService,
  ) {
    this.initializeTransporter();
    this.loadEmailTemplates();
  }

  private initializeTransporter(): void {
    const emailConfig = {
      host: this._configService.get<string>('SMTP_HOST', 'localhost'),
      port: this._configService.get<number>('SMTP_PORT', 587),
      secure: this._configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this._configService.get<string>('SMTP_USER'),
        pass: this._configService.get<string>('SMTP_PASS'),
      },
    };

    // Skip authentication if no user is provided (for development)
    if (!emailConfig.auth.user) {
      delete emailConfig.auth;
    }

    this.transporter = nodemailer.createTransport(emailConfig);

    this._loggerService.info('Email service initialized', 'EmailService');
  }

  private loadEmailTemplates(): void {
    // Welcome email template
    this.templates.set('welcome', {
      subject: 'Welcome to Sokoke Planner!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Welcome to Sokoke Planner!</h1>
          <p>Hi {{name}},</p>
          <p>Thank you for joining Sokoke Planner! We're excited to help you organize your projects and tasks efficiently.</p>
          <p>To get started, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{verificationUrl}}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="{{verificationUrl}}">{{verificationUrl}}</a></p>
          <p>This verification link will expire in 24 hours.</p>
          <p>Best regards,<br>The Sokoke Planner Team</p>
        </div>
      `,
      text: `
        Welcome to Sokoke Planner!
        
        Hi {{name}},
        
        Thank you for joining Sokoke Planner! We're excited to help you organize your projects and tasks efficiently.
        
        To get started, please verify your email address by visiting: {{verificationUrl}}
        
        This verification link will expire in 24 hours.
        
        Best regards,
        The Sokoke Planner Team
      `
    });

    // Email verification template
    this.templates.set('email-verification', {
      subject: 'Verify Your Email Address - Sokoke Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Verify Your Email Address</h1>
          <p>Hi {{name}},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{verificationUrl}}" style="background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="{{verificationUrl}}">{{verificationUrl}}</a></p>
          <p>This verification link will expire in 24 hours.</p>
          <p>Best regards,<br>The Sokoke Planner Team</p>
        </div>
      `,
      text: `
        Verify Your Email Address
        
        Hi {{name}},
        
        Please verify your email address by visiting: {{verificationUrl}}
        
        This verification link will expire in 24 hours.
        
        Best regards,
        The Sokoke Planner Team
      `
    });

    // Password reset template
    this.templates.set('password-reset', {
      subject: 'Reset Your Password - Sokoke Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Reset Your Password</h1>
          <p>Hi {{name}},</p>
          <p>You requested to reset your password for your Sokoke Planner account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetUrl}}" style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="{{resetUrl}}">{{resetUrl}}</a></p>
          <p>This password reset link will expire in 24 hours.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The Sokoke Planner Team</p>
        </div>
      `,
      text: `
        Reset Your Password
        
        Hi {{name}},
        
        You requested to reset your password for your Sokoke Planner account.
        
        Please visit this link to reset your password: {{resetUrl}}
        
        This password reset link will expire in 24 hours.
        
        If you didn't request this password reset, please ignore this email.
        
        Best regards,
        The Sokoke Planner Team
      `
    });

    // Password changed notification
    this.templates.set('password-changed', {
      subject: 'Password Changed - Sokoke Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Password Changed Successfully</h1>
          <p>Hi {{name}},</p>
          <p>Your password for Sokoke Planner has been successfully changed.</p>
          <p><strong>Change Details:</strong></p>
          <ul>
            <li>Date: {{changeDate}}</li>
            <li>IP Address: {{ipAddress}}</li>
            <li>User Agent: {{userAgent}}</li>
          </ul>
          <p>If you didn't make this change, please contact our support team immediately.</p>
          <p>Best regards,<br>The Sokoke Planner Team</p>
        </div>
      `,
      text: `
        Password Changed Successfully
        
        Hi {{name}},
        
        Your password for Sokoke Planner has been successfully changed.
        
        Change Details:
        - Date: {{changeDate}}
        - IP Address: {{ipAddress}}
        - User Agent: {{userAgent}}
        
        If you didn't make this change, please contact our support team immediately.
        
        Best regards,
        The Sokoke Planner Team
      `
    });

    // Project assignment notification
    this.templates.set('project-assigned', {
      subject: 'You\'ve been assigned to a project - Sokoke Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Project Assignment</h1>
          <p>Hi {{name}},</p>
          <p>You've been assigned to a new project in Sokoke Planner!</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c3e50;">{{projectName}}</h3>
            <p><strong>Description:</strong> {{projectDescription}}</p>
            <p><strong>Assigned by:</strong> {{assignedBy}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{projectUrl}}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Project
            </a>
          </div>
          <p>Best regards,<br>The Sokoke Planner Team</p>
        </div>
      `,
      text: `
        Project Assignment
        
        Hi {{name}},
        
        You've been assigned to a new project in Sokoke Planner!
        
        Project: {{projectName}}
        Description: {{projectDescription}}
        Assigned by: {{assignedBy}}
        Due Date: {{dueDate}}
        
        View project at: {{projectUrl}}
        
        Best regards,
        The Sokoke Planner Team
      `
    });

    // Task assignment notification
    this.templates.set('task-assigned', {
      subject: 'New task assigned - Sokoke Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Task Assignment</h1>
          <p>Hi {{name}},</p>
          <p>A new task has been assigned to you!</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c3e50;">{{taskName}}</h3>
            <p><strong>Description:</strong> {{taskDescription}}</p>
            <p><strong>Project:</strong> {{projectName}}</p>
            <p><strong>Assigned by:</strong> {{assignedBy}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
            <p><strong>Priority:</strong> {{priority}}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{taskUrl}}" style="background-color: #f39c12; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Task
            </a>
          </div>
          <p>Best regards,<br>The Sokoke Planner Team</p>
        </div>
      `,
      text: `
        Task Assignment
        
        Hi {{name}},
        
        A new task has been assigned to you!
        
        Task: {{taskName}}
        Description: {{taskDescription}}
        Project: {{projectName}}
        Assigned by: {{assignedBy}}
        Due Date: {{dueDate}}
        Priority: {{priority}}
        
        View task at: {{taskUrl}}
        
        Best regards,
        The Sokoke Planner Team
      `
    });

    // Task deadline reminder
    this.templates.set('task-deadline', {
      subject: 'Task Deadline Reminder - Sokoke Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e74c3c;">Task Deadline Reminder</h1>
          <p>Hi {{name}},</p>
          <p>This is a reminder that the following task is due {{dueStatus}}:</p>
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #856404;">{{taskName}}</h3>
            <p><strong>Description:</strong> {{taskDescription}}</p>
            <p><strong>Project:</strong> {{projectName}}</p>
            <p><strong>Due Date:</strong> {{dueDate}}</p>
            <p><strong>Priority:</strong> {{priority}}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{taskUrl}}" style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Update Task
            </a>
          </div>
          <p>Best regards,<br>The Sokoke Planner Team</p>
        </div>
      `,
      text: `
        Task Deadline Reminder
        
        Hi {{name}},
        
        This is a reminder that the following task is due {{dueStatus}}:
        
        Task: {{taskName}}
        Description: {{taskDescription}}
        Project: {{projectName}}
        Due Date: {{dueDate}}
        Priority: {{priority}}
        
        Update task at: {{taskUrl}}
        
        Best regards,
        The Sokoke Planner Team
      `
    });

    this._loggerService.info('Email templates loaded successfully', 'EmailService');
  }
  async sendEmail(options: TEmailOptions): Promise<boolean> {
    try {
      let { subject, html, text } = options;

      // If template is specified, use it
      if (options.template && this.templates.has(options.template)) {
        const template = this.templates.get(options.template)!;
        
        // Compile templates with context
        const subjectTemplate = handlebars.compile(template.subject);
        const htmlTemplate = handlebars.compile(template.html);
        const textTemplate = template.text ? handlebars.compile(template.text) : null;

        subject = subjectTemplate(options.context || {});
        html = htmlTemplate(options.context || {});
        text = textTemplate ? textTemplate(options.context || {}) : text;
      }

      // Ensure we have a subject
      if (!subject) {
        throw new Error('Email subject is required');
      }

      const mailOptions = {
        from: this._configService.get<string>('EMAIL_FROM', 'noreply@sokoke-planner.com'),
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
        subject,
        html,
        text,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      this._loggerService.info(`Email sent successfully to ${options.to}`, 'EmailService');
      this._loggerService.debug(`Email result: ${JSON.stringify(result)}`, 'EmailService');
      
      return true;
    } catch (error) {
      this._loggerService.error(
        `Failed to send email to ${options.to}: ${(error as Error).message}`,
        'EmailService'
      );
      
      // In development, don't throw errors for email failures
      if (this._configService.get<string>('NODE_ENV') === 'development') {
        this._loggerService.warn('Email sending disabled in development mode', 'EmailService');
        return true;
      }
      
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string, verificationUrl: string): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      template: 'welcome',
      context: {
        name: userName,
        verificationUrl,
      },
    });
  }

  async sendEmailVerification(userEmail: string, userName: string, verificationUrl: string): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      template: 'email-verification',
      context: {
        name: userName,
        verificationUrl,
      },
    });
  }

  async sendPasswordResetEmail(userEmail: string, userName: string, resetUrl: string): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      template: 'password-reset',
      context: {
        name: userName,
        resetUrl,
      },
    });
  }

  async sendPasswordChangedNotification(
    userEmail: string,
    userName: string,
    changeDate: string,
    ipAddress: string,
    userAgent: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      template: 'password-changed',
      context: {
        name: userName,
        changeDate,
        ipAddress,
        userAgent,
      },
    });
  }

  async sendProjectAssignmentNotification(
    userEmail: string,
    userName: string,
    projectName: string,
    projectDescription: string,
    assignedBy: string,
    dueDate: string,
    projectUrl: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      template: 'project-assigned',
      context: {
        name: userName,
        projectName,
        projectDescription,
        assignedBy,
        dueDate,
        projectUrl,
      },
    });
  }

  async sendTaskAssignmentNotification(
    userEmail: string,
    userName: string,
    taskName: string,
    taskDescription: string,
    projectName: string,
    assignedBy: string,
    dueDate: string,
    priority: string,
    taskUrl: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      template: 'task-assigned',
      context: {
        name: userName,
        taskName,
        taskDescription,
        projectName,
        assignedBy,
        dueDate,
        priority,
        taskUrl,
      },
    });
  }

  async sendTaskDeadlineReminder(
    userEmail: string,
    userName: string,
    taskName: string,
    taskDescription: string,
    projectName: string,
    dueDate: string,
    dueStatus: string,
    priority: string,
    taskUrl: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      template: 'task-deadline',
      context: {
        name: userName,
        taskName,
        taskDescription,
        projectName,
        dueDate,
        dueStatus,
        priority,
        taskUrl,
      },
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this._loggerService.info('Email service connection verified', 'EmailService');
      return true;
    } catch (error) {
      this._loggerService.error(
        `Email service connection failed: ${(error as Error).message}`,
        'EmailService'
      );
      return false;
    }
  }
}
