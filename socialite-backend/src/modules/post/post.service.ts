import { Injectable } from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { PostEntity } from "./entities/post.entity";
import { UserRepository } from "../user/user.repository";
import { PostMessage } from "./constants/post.messages";
import { PostRepository } from "./post.repository";
import { PostContentEntity } from "./entities/post_content.entity";

@Injectable()
export class PostService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly postRepository: PostRepository,
    ) { }

    // Create a new user
    async create(createPostInput: CreatePostInput, userId: string): Promise<PostEntity> {
        try {
            const user = await this.userRepository.findOne({ id: userId });

            if (!user.is_active) {
                throw new Error(PostMessage.ACCOUNT_BLOCKED);
            }
            const postEntityPayload = new PostEntity();
            postEntityPayload.user = user;
            const post = await this.postRepository.create(postEntityPayload);
            if (post) {
                let postContentPayload: Partial<PostContentEntity> = {};
                postContentPayload = { ...createPostInput };
                postContentPayload.post = post;
                await this.postRepository.createPostContent(postContentPayload);
                return post;
            }
            return post;
        } catch (error: unknown) {
            throw error;
        }
    }
}