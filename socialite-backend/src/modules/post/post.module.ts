import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostResolver } from './post.resolver';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
    ],
    controllers: [PostController],
    providers: [PostService, PostRepository, PostResolver],
    exports: [],
})
export class PostModule { }
