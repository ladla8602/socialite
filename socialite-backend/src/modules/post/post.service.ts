import { Injectable } from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { PostEntity } from "./entities/post.entity";
import { UserRepository } from "../user/user.repository";
import { PostMessage } from "./constants/post.messages";
import { PostRepository } from "./post.repository";
import { TagEntity } from "./entities/tag.entity";
import { PostTagEntity } from "./entities/post_tag.entity";
import { PostImageEntity } from "./entities/post_image.entity";
import { PageInfo } from "src/common/dto/pagination.dto";
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

            let posts = await this.postRepository.findPostsByUser(userId, first, after);

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
}