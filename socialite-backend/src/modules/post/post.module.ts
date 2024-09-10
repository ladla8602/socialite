import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostResolver } from './post.resolver';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';
import { PostContentEntity } from './entities/post_content.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity, PostContentEntity]),
        UserModule,
    ],
    controllers: [PostController],
    providers: [PostService, PostRepository, PostResolver],
    exports: [PostService, PostRepository],
})
export class PostModule { }
