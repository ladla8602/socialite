import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostResolver } from './post.resolver';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';
import { PostTagEntity } from './entities/post_tag.entity';
import { PostCommentEntity } from './entities/post_comment.entity';
import { PostLikeEntity } from './entities/post_like.entity';
import { TagEntity } from './entities/tag.entity';
import { PostVideoEntity } from './entities/post_video.entity';
import { PostImageEntity } from './entities/post_image.entity';
import { CommentRepository } from './comment.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PostEntity,
            PostTagEntity,
            PostCommentEntity,
            PostLikeEntity,
            PostVideoEntity,
            TagEntity,
            PostImageEntity,
        ]),
        UserModule,
    ],
    controllers: [PostController],
    providers: [PostService, PostRepository, PostResolver, CommentRepository],
    exports: [PostService, PostRepository, CommentRepository],
})
export class PostModule { }
