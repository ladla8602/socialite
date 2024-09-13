import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { PostEntity } from "./entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { TagEntity } from "./entities/tag.entity";
import { PostTagEntity } from "./entities/post_tag.entity";
import { PostImageEntity } from "./entities/post_image.entity";
import { BaseRepository } from "src/common/base.repository";
import { PageInfo } from "./../../common/dto/pagination.dto";

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

    async findPostsByUser(userId: string, first: number, after?: string): Promise<PostEntity[]> {
        const query = this.postRepository.createQueryBuilder('posts')
            .leftJoinAndSelect('posts.postTags', 'postTags')
            .leftJoinAndSelect('postTags.tag', 'tag')
            .leftJoinAndSelect('posts.postImages', 'postImages')
            .leftJoinAndSelect('posts.comments', 'comments');

        if (after) {
            query.where('posts.id > :after', { after });
        }

        query.andWhere('posts.userId = :userId', { userId });

        const posts = await query.take(first + 1).getMany();
        return posts;
    }

    insetPostImage(postData: Partial<PostImageEntity>) {
        this.postImageRepository.insert(postData);
    }

    insetPostImages(postData: Partial<PostImageEntity[]>) {
        this.postImageRepository.insert(postData);
    }

}