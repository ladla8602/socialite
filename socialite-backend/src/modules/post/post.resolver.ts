import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PostEntity } from './entities/post.entity';
import { PostInput } from './dto/post.input';
import { PinoLogger } from 'nestjs-pino';
import { PostService } from './post.service';
import { CurrentUser } from '../auth/jwt.guard';
import { UserEntity } from '../user/entities/user.entity';

@Resolver(() => PostEntity)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly logger: PinoLogger
    ) { }

    @Mutation(() => String)
    async postCreate(
        @Args('postInput') postInput: PostInput,
        @CurrentUser() user: UserEntity
    ) {
        try {
            console.log(postInput);
            const result = await this.postService.createPost(postInput);
            return result;
        } catch (error) {
            // Handle and log the error appropriately
            this.logger.error('Error during post mutation', error);
            throw error;
        }
    }
}
