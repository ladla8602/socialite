import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from '../auth/dto/create-user.input';
import { UserRepository } from './user.repository';
import { UserMessage } from './constants/user.message';
import { UserFollowEntity } from './entities/user_follow.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

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

    // Find all users
    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.findAll();
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
            console.log(existingFollow)
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
}
