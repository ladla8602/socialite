import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { SightengineProcessor } from 'src/sightengine.processor/sightengine.processor';
import { SightengineService } from 'src/sightengine.processor/sightengine.service';
import { BullModule } from '@nestjs/bull';
import { PostService } from '../post/post.service';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'sightengine',
            redis: {
                host: 'localhost', // Redis host
                port: 6379,        // Redis port
            },
        }),
        UserModule,
        PostModule,
    ],
    controllers: [UploadController],
    providers: [UploadService, SightengineProcessor, SightengineService],
    exports: [],
})
export class UploadModule { }
