import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { PostEntity } from "./entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { TagEntity } from "./entities/tag.entity";
import { PostTagEntity } from "./entities/post_tag.entity";
import { PostImageEntity } from "./entities/post_image.entity";
import { BaseRepository } from "src/common/base.repository";

@Injectable()
export class PostRepository extends BaseRepository<PostEntity> {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
        @InjectRepository(PostTagEntity)
        private readonly postTagsRepository: Repository<PostTagEntity>,
        @InjectRepository(PostImageEntity)
        private readonly postImageRepository: Repository<PostImageEntity>,
        private readonly logger: PinoLogger,
    ) {
        super(postRepository);
    }

    async createTags(postData: Partial<TagEntity>[]): Promise<TagEntity[]> {
        await this.tagRepository.upsert(postData, ['name']);
        // Fetch the saved tags from the database
        const tags = await this.tagRepository.findBy({
            name: In(postData.map(data => data.name)), // Use the appropriate unique field
        });
        return tags;
    }

    async createPostTags(postData: Partial<PostTagEntity>[]) {
        this.postTagsRepository.insert(postData);
    }

    async findPostsByUser(userId: string): Promise<PostEntity[]> {
        return this.postRepository.find({
            where: { user: { id: userId } },
            relations: ['postTags', 'postTags.tag']
        });
    }

    insetPostImage(postData: Partial<PostImageEntity>) {
        this.postImageRepository.insert(postData);
    }

    insetPostImages(postData: Partial<PostImageEntity[]>) {
        this.postImageRepository.insert(postData);
    }

}