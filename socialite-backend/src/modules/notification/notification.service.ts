import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as admin from 'firebase-admin';
import { PostEntity } from '../post/entities/post.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('push') private readonly pushQueue: Queue,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) { }

  async sendPushNotification(token: string, title: string, body: string, data: Record<string, string>) {
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    try {
      const response = await this.firebaseAdmin.messaging().send(message);
      console.log('Push notification sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }


  async sendPushNotificationJob(
    tokens: string[],
    notification: admin.messaging.Notification,
    data: Record<string, string>,
  ) {
    await this.pushQueue.add('sendPushNotification', {
      tokens,
      notification,
      data,
    });
  }

  async sendPostLikeNotification(post: PostEntity, user: UserEntity) {
    const author = post.user;
    if (author && author.device_token && post.user.id !== user.id) {
      const message = {
        notification: {
          title: 'New Like',
          body: `${user?.full_name} liked your post`,
        },
        data: {
          type: 'like',
          postId: post.id,
        },
      };
      await this.sendPushNotificationJob([author.device_token], message.notification, message.data);
    }

  }
}
