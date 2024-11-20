import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { BullModule, InjectQueue, getQueueToken } from '@nestjs/bull';
import { PushNotificationProcessor } from './notification.processor';
import * as path from 'path';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { Queue } from 'bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost', // Update with your Redis host
        port: 6379,        // Update with your Redis port
      },
    }),
    BullModule.registerQueue(
      { name: 'push' }, // Queue for push notifications
      { name: 'email' }, // Queue for email notifications
      { name: 'sms' },   // Queue for SMS notifications
    ),
  ],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serviceAccountPath = path.resolve(
          process.cwd(),
          configService.get<string>('FIREBASE_CONFIG_PATH')
        );
        const serviceAccount = require(serviceAccountPath); // Load the service account JSON file.

        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      },
    },
    NotificationService,
    PushNotificationProcessor,
  ],
  exports: [BullModule, NotificationService],
})
export class NotificationModule implements NestModule {
  constructor(
    @InjectQueue('push') private readonly pushQueue: Queue,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('sms') private readonly smsQueue: Queue,
  ) { }


  async configure(consumer: MiddlewareConsumer) {
    // Initialize Bull Board Express Adapter
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/bull-board');

    // Create Bull Board instance
    const { setQueues } = createBullBoard({
      queues: [
        new BullAdapter(this.pushQueue),
        new BullAdapter(this.emailQueue),
        new BullAdapter(this.smsQueue),
      ],
      serverAdapter,
    });

    // Add the Bull Board route
    consumer.apply(serverAdapter.getRouter()).forRoutes('/bull-board');
  }
}
