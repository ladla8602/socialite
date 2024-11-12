import { Controller, Req } from "@nestjs/common";
import { PostRoute } from "./constants/post.routes";
import { PostService } from "./post.service";
import { PinoLogger } from "nestjs-pino";
import { OpenAiService } from "src/common/services/openai.service";

@Controller(PostRoute.POST)
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly logger: PinoLogger,
    ) { }
}