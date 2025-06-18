import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '@src/shared/services/logger.service';
import { EmailService } from '@src/shared/services/email.service';
import { TaskService } from '@src/planner/services/task.service';
import { ProjectService } from '@src/planner/services/project.service';
import { UserService } from '@src/user/services/user.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _loggerService: LoggerService,
    private readonly _emailService: EmailService,
    private readonly _taskService: TaskService,
    private readonly _projectService: ProjectService,
    private readonly _userService: UserService,
  ) {}

  /**
   * Check for tasks due soon and send reminder emails
   * Runs daily at 9 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendTaskDeadlineReminders(): Promise<void> {
    this._loggerService.info('Starting task deadline reminder job', 'NotificationService');

    try {
      const tasksResponse = await this._taskService.readAll();
      if (tasksResponse.status !== 'success' || !tasksResponse.data) {
        this._loggerService.warn('No tasks found for deadline checking', 'NotificationService');
        return;
      }

      const tasks = tasksResponse.data;
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      for (const task of tasks) {
        if (!task.endDate || task.completed) {
          continue; // Skip tasks without due dates or completed tasks
        }

        const dueDate = new Date(task.endDate);
        let shouldNotify = false;
        let dueStatus = '';

        // Check if task is overdue
        if (dueDate < now) {
          shouldNotify = true;
          const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000));
          dueStatus = `${daysOverdue} day(s) overdue`;
        }
        // Check if task is due tomorrow
        else if (dueDate <= tomorrow) {
          shouldNotify = true;
          dueStatus = 'tomorrow';
        }
        // Check if task is due within a week
        else if (dueDate <= nextWeek) {
          shouldNotify = true;
          const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          dueStatus = `in ${daysUntilDue} day(s)`;
        }

        if (shouldNotify) {
          await this.sendTaskDeadlineNotification(task, dueStatus);
        }
      }

      this._loggerService.info('Task deadline reminder job completed', 'NotificationService');
    } catch (error) {
      this._loggerService.error(
        `Task deadline reminder job failed: ${(error as Error).message}`,
        'NotificationService'
      );
    }
  }

  /**
   * Check for projects due soon and send reminder emails
   * Runs daily at 10 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendProjectDeadlineReminders(): Promise<void> {
    this._loggerService.info('Starting project deadline reminder job', 'NotificationService');

    try {
      const projectsResponse = await this._projectService.readAll();
      if (projectsResponse.status !== 'success' || !projectsResponse.data) {
        this._loggerService.warn('No projects found for deadline checking', 'NotificationService');
        return;
      }

      const projects = projectsResponse.data;
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      for (const project of projects) {
        if (!project.endDate || project.completed) {
          continue; // Skip projects without due dates or completed projects
        }

        const dueDate = new Date(project.endDate);
        let shouldNotify = false;
        let dueStatus = '';

        // Check if project is overdue
        if (dueDate < now) {
          shouldNotify = true;
          const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000));
          dueStatus = `${daysOverdue} day(s) overdue`;
        }
        // Check if project is due within a week
        else if (dueDate <= nextWeek) {
          shouldNotify = true;
          const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          dueStatus = `in ${daysUntilDue} day(s)`;
        }

        if (shouldNotify && project.owners && project.owners.length > 0) {
          await this.sendProjectDeadlineNotification(project, dueStatus);
        }
      }

      this._loggerService.info('Project deadline reminder job completed', 'NotificationService');
    } catch (error) {
      this._loggerService.error(
        `Project deadline reminder job failed: ${(error as Error).message}`,
        'NotificationService'
      );
    }
  }

  /**
   * Send task deadline notification
   */
  private async sendTaskDeadlineNotification(task: any, dueStatus: string): Promise<void> {
    try {
      // For now, we'll need to find project owners since tasks don't have assigned users
      // This could be enhanced by adding assignedTo field to tasks
      const projectIds = Array.isArray(task.prevProjects) ? task.prevProjects : [];
      const userIds = new Set<string>();

      // Collect owners from all related projects
      for (const projectId of projectIds) {
        try {
          const projectResponse = await this._projectService.read(
            typeof projectId === 'string' ? projectId : projectId._id
          );
          
          if (projectResponse.status === 'success' && projectResponse.data?.owners) {
            projectResponse.data.owners.forEach((owner: any) => {
              const ownerId = typeof owner === 'string' ? owner : owner._id;
              userIds.add(ownerId);
            });
          }
        } catch (error) {
          this._loggerService.warn(
            `Could not fetch project ${projectId} for task deadline notification`,
            'NotificationService'
          );
        }
      }

      // Send notifications to all project owners
      const frontendUrl = this._configService.get<string>('frontendUrl') || 'http://localhost:3001';
      const taskUrl = `${frontendUrl}/tasks/${task._id}`;

      for (const userId of userIds) {
        try {
          const userResponse = await this._userService.read(userId);
          if (userResponse.status === 'success' && userResponse.data) {
            const user = userResponse.data;
            
            await this._emailService.sendTaskDeadlineReminder(
              user.email,
              `${user.name} ${user.lastName}`,
              task.name || 'Untitled Task',
              task.description || 'No description provided',
              'Related Project',
              task.endDate.toLocaleDateString(),
              dueStatus,
              task.priority?.toString() || 'Normal',
              taskUrl
            );
            
            this._loggerService.info(
              `Task deadline reminder sent to ${user.email} for task ${task.name}`,
              'NotificationService'
            );
          }
        } catch (error) {
          this._loggerService.error(
            `Failed to send task deadline notification to user ${userId}: ${(error as Error).message}`,
            'NotificationService'
          );
        }
      }
    } catch (error) {
      this._loggerService.error(
        `Failed to send task deadline notification for task ${task._id}: ${(error as Error).message}`,
        'NotificationService'
      );
    }
  }

  /**
   * Send project deadline notification
   */
  private async sendProjectDeadlineNotification(project: any, dueStatus: string): Promise<void> {
    try {
      const frontendUrl = this._configService.get<string>('frontendUrl') || 'http://localhost:3001';
      const projectUrl = `${frontendUrl}/projects/${project._id}`;

      const ownerIds = Array.isArray(project.owners) ? project.owners : [];

      for (const ownerId of ownerIds) {
        try {
          const userId = typeof ownerId === 'string' ? ownerId : ownerId._id;
          const userResponse = await this._userService.read(userId);
          
          if (userResponse.status === 'success' && userResponse.data) {
            const user = userResponse.data;
            
            await this._emailService.sendEmail({
              to: user.email,
              subject: `Project Deadline Reminder - ${project.name}`,
              template: 'task-deadline', // Reusing task deadline template for projects
              context: {
                name: `${user.name} ${user.lastName}`,
                taskName: project.name || 'Untitled Project',
                taskDescription: project.description || 'No description provided',
                projectName: project.name,
                dueDate: project.endDate.toLocaleDateString(),
                dueStatus,
                priority: project.priority?.toString() || 'Normal',
                taskUrl: projectUrl,
              },
            });
            
            this._loggerService.info(
              `Project deadline reminder sent to ${user.email} for project ${project.name}`,
              'NotificationService'
            );
          }
        } catch (error) {
          this._loggerService.error(
            `Failed to send project deadline notification to user ${ownerId}: ${(error as Error).message}`,
            'NotificationService'
          );
        }
      }
    } catch (error) {
      this._loggerService.error(
        `Failed to send project deadline notification for project ${project._id}: ${(error as Error).message}`,
        'NotificationService'
      );
    }
  }

  /**
   * Send a test email to verify email service configuration
   */
  async sendTestEmail(recipientEmail: string): Promise<boolean> {
    try {
      const result = await this._emailService.sendEmail({
        to: recipientEmail,
        subject: 'Sokoke Planner - Email Service Test',
        html: `
          <h1>Email Service Test</h1>
          <p>This is a test email from Sokoke Planner API.</p>
          <p>If you received this email, the email service is working correctly.</p>
          <p>Test sent at: ${new Date().toISOString()}</p>
        `,
        text: `
          Email Service Test
          
          This is a test email from Sokoke Planner API.
          If you received this email, the email service is working correctly.
          Test sent at: ${new Date().toISOString()}
        `,
      });

      this._loggerService.info(`Test email sent to ${recipientEmail}`, 'NotificationService');
      return result;
    } catch (error) {
      this._loggerService.error(
        `Failed to send test email to ${recipientEmail}: ${(error as Error).message}`,
        'NotificationService'
      );
      return false;
    }
  }
}
