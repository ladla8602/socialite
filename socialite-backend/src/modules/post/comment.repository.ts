
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostCommentEntity } from "./entities/post_comment.entity";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class CommentRepository {
    constructor(
        @InjectRepository(PostCommentEntity)
        private readonly commentRepository: Repository<PostCommentEntity>,

        private readonly logger: PinoLogger,
    ) { }

    async createComment(commentPayload: Partial<PostCommentEntity>): Promise<PostCommentEntity> {
        const post = this.commentRepository.create(commentPayload);
        return this.commentRepository.save(post);
    }
}