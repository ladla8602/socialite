import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { PostEntity } from "./entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostContentEntity } from "./entities/post_content.entity";

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(PostContentEntity)
        private readonly postContentRepository: Repository<PostContentEntity>,
        private readonly logger: PinoLogger,
    ) { }

    async create(postData: Partial<PostEntity>): Promise<PostEntity> {
        const post = this.postRepository.create(postData);
        return this.postRepository.save(post);
    }

    async createPostContent(postData: Partial<PostContentEntity>): Promise<PostContentEntity> {
        const user = this.postContentRepository.create(postData);
        return this.postContentRepository.save(user);
    }
}