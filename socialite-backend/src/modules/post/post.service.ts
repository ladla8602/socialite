import { Injectable } from "@nestjs/common";
import { PostInput } from "./dto/post.input";
import { PostEntity } from "./entities/post.entity";

@Injectable()
export class PostService {
    constructor(
    ) { }

    async createPost(postInput: PostInput): Promise<PostEntity | any> {
        try {
            // const post = await this.userRepository.findOneByIdentity(postInput);

            // return post;
        } catch (error: unknown) {
            throw error;
        }
    }
}