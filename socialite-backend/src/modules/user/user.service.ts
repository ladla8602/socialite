import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from '../auth/dto/create-user.input';
import { UserRepository } from './user.repository';
import { UserMessage } from './constants/user.message';
import { UserFollowEntity } from './entities/user_follow.entity';
import { PaginatedUser } from './dto/user.response.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async findByGoogleId(googleId: string) {
        return this.userRepository.findOneByGoogleId(googleId);
    }

    async findOneByIdentity(identity: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOneByIdentity(identity);
            return user;
        } catch (error: unknown) {
            throw null;
        }
    }

    async findOneById(id: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOne(id);
            return user;
        } catch (error: unknown) {
            throw null;
        }
    }

    async findOneByUsername(username: string): Promise<Boolean> {
        try {
            const user = await this.userRepository.findOneByUsername(username);
            if (user) {
                return true;
            }
            return false;
        } catch (error: unknown) {
            throw null;
        }
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        const user = await this.userRepository.findOneByEmail(email);
        return user;
    }

    // Create a new user
    async create(createUserInput: CreateUserInput): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOneByIdentity(createUserInput.identity);
            const username = await this.userRepository.findOneByUsername(createUserInput.username);
            if (username) {
                throw new Error(UserMessage.USERNAME_EXISTS);
            }
            if (!user) {
                const newUser = await this.userRepository.create(createUserInput);
                return newUser;
            }
            throw new Error(UserMessage.USER_ALREADY_EXISTS);
        } catch (error: unknown) {
            throw error;
        }
    }

    async followUser(followerId: string, followingId: string): Promise<UserFollowEntity> {
        try {
            const follower = await this.userRepository.findOne(followerId);
            const followed = await this.userRepository.findOne(followingId);

            if (!follower || !followed) {
                throw new Error(UserMessage.USER_NOT_FOUND);
            }

            // Check if the follow relationship already exists
            const existingFollow = await this.userRepository.checkFollowUser(followerId, followingId);

            if (existingFollow) {
                throw new Error(UserMessage.ALREADY_FOLLOWING);
            }
            const userFollowEnity: Partial<UserFollowEntity> = {};
            userFollowEnity.follower = follower;
            userFollowEnity.followed = followed;

            const result = await this.userRepository.createFollowUser(userFollowEnity);

            return result;
        } catch (error: unknown) {
            throw error;
        }
    }

    async unfollowUser(followerId: string, followingId: string): Promise<string> {
        try {
            // Check if both users exist
            const follower = await this.userRepository.findOne(followerId);
            const followed = await this.userRepository.findOne(followingId);

            if (!follower || !followed) {
                throw new Error(UserMessage.USER_NOT_FOUND);
            }

            // Check if the follow relationship exists
            const existingFollow = await this.userRepository.checkFollowUser(followerId, followingId);

            if (!existingFollow) {
                throw new Error(UserMessage.NOT_FOLLOWING);
            }
            // Remove the follow relationship
            const result = await this.userRepository.removeFollowUser(existingFollow);
            if (result) {
                return UserMessage.UNFOLLOW_SUCCESS;
            }
            throw new Error(UserMessage.SOMETHING_WENT_WRONG);
        } catch (error: unknown) {
            throw error;
        }
    }

    async countFollowedByUser(userId: string): Promise<number> {
        try {
            return await this.userRepository.countFollowedByUser(userId);
        } catch (error: unknown) {
            throw error;
        }
    }

    async countFollowerByUser(userId: string): Promise<number> {
        try {
            return await this.userRepository.countFollowerByUser(userId);
        } catch (error: unknown) {
            throw error;
        }
    }

    async followedByUser(userId: string, first: number, after?: string): Promise<PaginatedUser> {
        try {

            let posts = await this.userRepository.followedByUser(userId, first, after);

            const edges = posts.slice(0, first);
            const hasNextPage = posts.length > first;

            return {
                edges,
                pageInfo: {
                    hasNextPage,
                    hasPreviousPage: !!after,
                    startCursor: edges.length ? edges[0].id : null,
                    endCursor: edges.length ? edges[edges.length - 1].id : null,
                },
            };
        } catch (error: unknown) {
            throw error;
        }
    }
}
