import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserInput } from '../auth/dto/create-user.input';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ForbiddenException, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserFollowEntity } from './entities/user_follow.entity';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { UserUpdateDto } from './dto/request-user.dto';
import { PaginatedUser } from './dto/response-user.dto';

@Resolver(() => UserEntity)
export class UserResolver {
    authService: any;
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
        try {
            const userId = context.req.user.id;  // Get the current logged-in user's ID
            const followedCount = await this.userService.countFollowedByUser(userId);
            const followerCount = await this.userService.countFollowerByUser(userId);
            const user = await this.userService.findOneById(userId);
            user.followedCount = followedCount;
            user.followerCount = followerCount;
            return user;
        } catch (error) {
            // Handle and log the error appropriately
            this.logger.error('Error during profile query', error);
            throw error;
        }
    }

    @Query(() => UserEntity)
    @UseGuards(JwtAuthGuard)
    async updateUserProfile(
        @Context() context: any,
        @Args('userId') userId: string,
        @Args('data') updateData: UserUpdateDto
    ): Promise<UserEntity> {
        const currentUserId = context.req.user.id;
        if (currentUserId !== userId) {
            throw new ForbiddenException('You can only update your own profile');
        }
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isEmailChanged = updateData.identity && updateData.identity !== user.identity;
        Object.assign(user, updateData);
        const updatedUser = await this.userService.save(user);
        if (isEmailChanged) {
            const newToken = await this.authService.generateToken(updatedUser);
            context.res.setHeader('Authorization', `Bearer ${newToken}`);
        }
        return updatedUser;
    }


    @Query(() => PaginatedUser)
    @UseGuards(JwtAuthGuard)
    async followed(
        @Args() paginationArgs: PaginationArgs,
        @Context() context: any,
    ) {
        const { first, after } = paginationArgs;
        const userId = context.req.user.id;
        try {
            return this.userService.followedByUser(userId, first, after);
        } catch (error) {
            // Handle and log the error appropriately
            this.logger.error('Error during followed query', error);
            throw error;
        }
    }
}
