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
import { PostCommentEntity } from "./entities/post_comment.entity";
import { Parent } from "@nestjs/graphql";

@Injectable()
export class PostRepository extends BaseRepository<PostEntity> {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
        @InjectRepository(PostTagEntity)
        private readonly postTagsRepository: Repository<PostTagEntity>,
        @InjectRepository(PostCommentEntity)
        private readonly commentRepository: Repository<PostCommentEntity>,
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

    async commentsCount(postId: string): Promise<number> {
        const count = await this.commentRepository.count({ where: { post: { id: postId } } });
        console.log(count)
        return count;
    }

    async findPostsByUser(userId: string, first: number, after?: string): Promise<PostEntity[]> {
        const query = this.postRepository.createQueryBuilder('posts')
            .leftJoin('posts.postTags', 'postTags')
            .leftJoin('postTags.tag', 'tag')
            .addSelect(['tag.id', 'tag.name'])
            .leftJoinAndSelect('posts.postImages', 'postImages', 'postImages.is_active = :isActive', { isActive: true })
            .addSelect(subQuery => {
                return subQuery
                    .select('COUNT(comments.id)', 'commentsCount')
                    .from(PostCommentEntity, 'comments')
                    .where('comments.postId = posts.id');
            }, 'commentsCount')
            .where('posts.userId = :userId', { userId: userId })
            .andWhere('posts.is_active = true');

        if (after) {
            query.where('posts.id > :after', { after });
        }

        // Fetch posts and comments count
        const results = await query.take(first + 1).getRawAndEntities();

        const posts = results.entities as PostEntity[];
        const rawResults = results.raw as any[];
        // Map comments count to posts
        const commentsCountMap = new Map<string, number>(
            rawResults.map(result => [result.posts_id, parseInt(result.commentsCount, 10)])
        );

        posts.forEach(post => {
            post.commentsCount = commentsCountMap.get(post.id) || 0;
            post.tags = rawResults
                .filter(result => result.tag_id && result.tag_name)
                .map(result => ({
                    id: result.tag_id,
                    name: result.tag_name
                }));
        });
        return posts;
    }

    insetPostImage(postData: Partial<PostImageEntity>) {
        this.postImageRepository.insert(postData);
    }

    insetPostImages(postData: Partial<PostImageEntity[]>) {
        this.postImageRepository.insert(postData);
    }

    async createComment(commentPayload: Partial<PostCommentEntity>): Promise<PostCommentEntity> {
        const post = this.commentRepository.create(commentPayload);
        return this.commentRepository.save(post);
    }

}