import { Injectable } from "@nestjs/common";
import { CreateCommentInput, CreatePostInput } from "./dto/create-post.input";
import { PostEntity } from "./entities/post.entity";
import { UserRepository } from "../user/user.repository";
import { PostMessage } from "./constants/post.messages";
import { PostRepository } from "./post.repository";
import { TagEntity } from "./entities/tag.entity";
import { PostTagEntity } from "./entities/post_tag.entity";
import { PostImageEntity } from "./entities/post_image.entity";
import { PostCommentEntity } from "./entities/post_comment.entity";
import { PaginatedPost } from "./dto/post.response.dto";

@Injectable()
export class PostService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly postRepository: PostRepository,

    ) { }

    // Create a new user
    async create(createPostInput: CreatePostInput, userId: string): Promise<PostEntity> {
        try {
            const user = await this.userRepository.findOne(userId);

            if (!user.is_active) {
                throw new Error(PostMessage.ACCOUNT_BLOCKED);
            }
            let postEntityPayload: Partial<PostEntity> = {};
            postEntityPayload = { ...createPostInput };
            postEntityPayload.user = user;
            const post = await this.postRepository.create(postEntityPayload);
            if (post) {
                // create tags
                if (createPostInput.hashTags) {
                    const tags: Partial<TagEntity>[] = createPostInput.hashTags.split(',').map(tagName => ({
                        name: tagName.trim(),
                    }));
                    // Upsert tags
                    const resultTags = await this.postRepository.createTags(tags);

                    const postTags: Partial<PostTagEntity>[] = resultTags.map((tag => ({
                        postId: post.id,
                        tagId: tag.id
                    })));
                    // Create posts-tags pivot
                    this.postRepository.createPostTags(postTags);
                }
                return post;
            }
            throw new Error(PostMessage.POST_FAILED);
        } catch (error: unknown) {
            throw error;
        }
    }

    async findPostsByUser(userId: string, first: number, after?: string): Promise<PaginatedPost> {
        try {
            let posts = await this.postRepository.findPostsByUser(userId, first, after)
            const edges = posts.slice(0, first);
            const hasNextPage = posts.length > first;

            return {
                edges,
                pageInfo: {
                    hasNextPage,
                    hasPreviousPage: !!after,
                    startCursor: edges.length ? edges[0].id : null,
                    endCursor: edges.length ? edges[edges.length - 1].id : null,
                },
            };
        } catch (error: unknown) {
            throw error;
        }
    }

    async findPosts(category: string, userId: string, first: number, after?: string): Promise<PaginatedPost> {
        try {
            let posts = await this.postRepository.findPostsByCategory(category, userId, first, after)
            const edges = posts.slice(0, first);
            const hasNextPage = posts.length > first;

            return {
                edges,
                pageInfo: {
                    hasNextPage,
                    hasPreviousPage: !!after,
                    startCursor: edges.length ? edges[0].id : null,
                    endCursor: edges.length ? edges[edges.length - 1].id : null,
                },
            };
        } catch (error: unknown) {
            throw error;
        }

    }
   


    async savePostImage(postId: string, image_url: string, status: boolean) {
        const post = await this.postRepository.findOne(postId);
        if (post) {
            const urlObj = new URL(image_url);
            const pathOnly = urlObj.pathname;
            const pathWithoutLeadingSlash = pathOnly.startsWith('/') ? pathOnly.substring(1) : pathOnly;

            const postImage: Partial<PostImageEntity> = {};
            postImage.post = post;
            postImage.image_url = pathWithoutLeadingSlash;
            postImage.is_active = status;
            this.postRepository.insetPostImage(postImage);
        }
    }
    async addPostComment(createCommentInput: CreateCommentInput, userId: string): Promise<PostEntity> {
        try {
            // Find the user who is adding the comment
            const user = await this.userRepository.findOne(userId);

            if (!user.is_active) {
                throw new Error(PostMessage.ACCOUNT_BLOCKED);
            }

            // Find the post by its ID to which the comment will be added
            const post = await this.postRepository.findOne(createCommentInput.postId); // Assuming postId is part of CreateCommentInput

            if (!post) {
                throw new Error(PostMessage.POST_NOT_FOUND);
            }

            // Create the comment entity
            const commentPayload: Partial<PostCommentEntity> = {
                content: createCommentInput.content,
                user: user,
                post: post, // Link the comment to the found post
            };

            // Save the comment to the repository
            const comment = await this.postRepository.createComment(commentPayload);
            if (comment) {
                return post;
            }

            throw new Error(PostMessage.COMMENT_FAILED);
        } catch (error: unknown) {
            throw error;
        }
    }


}