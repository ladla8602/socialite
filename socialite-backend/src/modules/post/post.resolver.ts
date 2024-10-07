import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostEntity } from './entities/post.entity';
import { CreateCommentInput, CreatePostInput } from './dto/create-post.input';
import { PinoLogger } from 'nestjs-pino';
import { PostService } from './post.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PostCommentEntity } from './entities/post_comment.entity';

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
    async getUserPosts(
        @Args() paginationArgs: PaginationArgs,
        @Context() context: any,
    ) {
        const { first, after } = paginationArgs;
        try {
            const userId = context.req.user.id;
            return await this.postService.findPostsByUser(userId, first, after);
        } catch (error) {
            this.logger.error('Error during getUserPosts mutation', error);
            throw error;
        }
    }

    @Query(() => PaginatedPost)
    @UseGuards(JwtAuthGuard)
    async getPosts(
        @Args() paginationArgs: PaginationArgs,
        @Args('category', { type: () => String }) category: string,
        @Context() context: any,
    ) {
        const { first, after } = paginationArgs;
        try {
            const userId = context.req.user.id;
            return await this.postService.findPosts(category, userId, first, after);
        } catch (error) {
            this.logger.error('Error during getPosts mutation', error);
            throw error;
        }
    }

    @Mutation(() => PostCommentEntity)
    @UseGuards(JwtAuthGuard)
    async addPostComment(
        @Args('addPostComment') addPostCommentInput: CreateCommentInput,
        @Context() context: any
    ) {
        try {
            const userId = context.req.user.id;
            return this.postService.addPostComment(addPostCommentInput, userId);
        } catch (error) {

            this.logger.error('Error during addPost mutation', error);
            throw error;
        }
    }
}
