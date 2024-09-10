import { Controller } from "@nestjs/common";
import { PostRoute } from "./constants/post.routes";

@Controller(PostRoute.POST)
export class PostController {
    constructor() {

    }
}