import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostEntity } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { PinoLogger } from 'nestjs-pino';
import { PostService } from './post.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver(() => PostEntity)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly logger: PinoLogger
    ) { }

    @Mutation(() => PostEntity)
    @UseGuards(JwtAuthGuard)
    async createPost(
        @Args('createPostInput') createPostInput: CreatePostInput,
        @Context() context: any
    ) {
        try {
            const userId = context.req.user.id;
            return this.postService.create(createPostInput, userId);
        } catch (error) {
            // Handle and log the error appropriately
            this.logger.error('Error during createPost mutation', error);
            throw error;
        }
    }

    @Query(() => [PostEntity])
    @UseGuards(JwtAuthGuard)
    async getPosts(@Context() context: any) {
        try {
            const userId = context.req.user.id;
            return this.postService.findPostsByUser(userId);
        } catch (error) {
            this.logger.error('Error during getPosts mutation', error);
            throw error;
        }
    }
}
