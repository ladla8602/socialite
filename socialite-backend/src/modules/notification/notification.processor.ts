import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import * as admin from 'firebase-admin';

@Processor('push')
export class PushNotificationProcessor {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) { }

  @Process('sendPushNotification')
  async handlePushNotificationJob(job: Job) {
    const { tokens, notification, data } = job.data;

    try {
      const response = await this.firebaseAdmin.messaging().sendEachForMulticast({
        tokens,
        notification,
        data,
      });
      console.log(`Successfully sent notifications: ${response.successCount}`);
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }
}


// @Processor('email')
// export class EmailQueueProcessor {
//   constructor(private readonly notificationService: NotificationService) {}

//   @Process()
//   async handleEmailNotification(job: Job) {
//     const { to, subject, text, html } = job.data;
//     await this.notificationService.sendEmail(to, subject, text, html);
//   }
// }

// @Processor('sms')
// export class SmsQueueProcessor {
//   constructor(private readonly notificationService: NotificationService) {}

//   @Process()
//   async handleSmsNotification(job: Job) {
//     const { to, message } = job.data;
//     await this.notificationService.sendSms(to, message);
//   }
// }
