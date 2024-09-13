import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostEntity } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { PinoLogger } from 'nestjs-pino';
import { PostService } from './post.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { PaginatedPost } from './dto/post.response.dto';
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

    @Query(() => PaginatedPost)
    @UseGuards(JwtAuthGuard)
    async getPosts(
        @Args() paginationArgs: PaginationArgs,
        @Context() context: any,
    ) {
        const { first, after } = paginationArgs;
        try {
            const userId = context.req.user.id;
            return await this.postService.findPostsByUser(userId, first, after);
        } catch (error) {
            this.logger.error('Error during getPosts mutation', error);
            throw error;
        }
    }
}
