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
import { PostRepository } from './post.repository';
import { PostLikeEntity } from './entities/post_like.entity';

@Resolver(() => PostEntity)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly logger: PinoLogger,
        private readonly postRepository: PostRepository,
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
    ///post like////
    @Mutation(() => PostLikeEntity)
    @UseGuards(JwtAuthGuard)
    async likePost(
        @Args('postId') postId: string,
        @Context() context: any
    ): Promise<PostLikeEntity> {
        const userId = context.req.user.id;

        try {

            const existingLike = await this.postRepository.findLikeByPostAndUser(postId, userId);

            if (existingLike) {

                const removedLike = await this.postRepository.unlikePost(postId, userId);
                return removedLike;
            } else {
                const newLike = await this.postRepository.likePost(postId, userId);
                return newLike;
            }

        } catch (error) {
            this.logger.error('Error liking/unliking the post', error);
            throw new Error('Error handling post like');
        }

    }
}
