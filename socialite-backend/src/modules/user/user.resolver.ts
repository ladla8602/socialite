import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserInput } from '../auth/dto/create-user.input';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserFollowEntity } from './entities/user_follow.entity';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly logger: PinoLogger,
        private readonly pubSub: PubSub,
    ) { }

    @Mutation(() => UserFollowEntity)
    @UseGuards(JwtAuthGuard)
    async follow(
        @Context() context: any,
        @Args('followingId', { type: () => String }) followingId: string,
    ) {
        try {
            const followerId = context.req.user.id;  // Get the current logged-in user's ID
            return this.userService.followUser(followerId, followingId);
        } catch (error) {
            // Handle and log the error appropriately
            this.logger.error('Error during follow mutation', error);
            throw error;
        }
    }

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    async unfollow(
        @Context() context: any,
        @Args('followingId', { type: () => String }) followingId: string,
    ) {
        try {
            const followerId = context.req.user.id;  // Get the current logged-in user's ID
            return this.userService.unfollowUser(followerId, followingId);
        } catch (error) {
            // Handle and log the error appropriately
            this.logger.error('Error during unfollow mutation', error);
            throw error;
        }
    }

    @Query(() => UserEntity)
    @UseGuards(JwtAuthGuard)
    async profile(
        @Context() context: any,
    ) {
        return context.req.user;
        // try {
        //     const followerId = id;  // Get the current logged-in user's ID
        //     return this.userService.unfollowUser(followerId, followingId);
        // } catch (error) {
        //     // Handle and log the error appropriately
        //     this.logger.error('Error during unfollow mutation', error);
        //     throw error;
        // }
    }
}
