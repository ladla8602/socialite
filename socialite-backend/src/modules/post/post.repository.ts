import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { PostEntity } from "./entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PostRepository {
    constructor(
        @InjectRepository(PostEntity)
        private readonly userRepository: Repository<PostEntity>,
        private readonly logger: PinoLogger,
    ) { }


}