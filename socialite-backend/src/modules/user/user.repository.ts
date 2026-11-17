import { DeleteResult, FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { Cache } from 'cache-manager';
import { UserFollowEntity } from './entities/user_follow.entity';
import { BaseRepository } from 'src/common/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
    constructor(
        // @Inject('CACHE_MANAGER') private cacheManager: Cache,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(UserFollowEntity)
        private readonly userFollowRepository: Repository<UserFollowEntity>,
        private readonly logger: PinoLogger,
    ) {
        super(userRepository);
        this.logger.setContext(UserRepository.name);
    }

    async findAll(): Promise<UserEntity[] | undefined> {
        this.logger.info(`Fetching all users`);
        return await this.userRepository.find();
    }

    async findOneByIdentity(identity: string): Promise<UserEntity | undefined> {
        this.logger.info(`Fetching user with identity: ${identity}`);

        const cacheKey = `user-${identity}`;

        try {
            // Attempt to get the data from the cache
            // let user = await this.cacheManager.get<UserEntity | undefined>(cacheKey);

            // if (user) {
            //     this.logger.info(`Cache hit for identity: ${identity}`);
            //     return user;
            // }

            // this.logger.info(`Cache miss for identity: ${identity}. Fetching from database.`);

            // Fetch from the database (support email or username)
            let user = await this.userRepository.findOne({
                where: [
                    { identity },
                    { username: identity },
                ],
            });

            // if (user) {
            //     // Store the result in the cache with a TTL
            //     await this.cacheManager.set(cacheKey, user, 300);
            // } else {
            //     return undefined;
            // }

            return user;
        } catch (error: any) {
            this.logger.error(`Error fetching user with identity: ${identity} - ${error?.message || error}`);
            return undefined;
        }
    }

    async findOneByGoogleId(googleId: string): Promise<UserEntity | undefined> {
        this.logger.info(`Fetching user with googleId: ${googleId}`);
        return await this.userRepository.findOne({ where: { google_id: googleId } });
    }

    async findOneByUsername(username: string): Promise<UserEntity | undefined> {
        this.logger.info(`Fetching user with username: ${username}`);
        return await this.userRepository.findOne({ where: { username: username } });
    }

    async findOneByEmail(email: string): Promise<UserEntity | undefined> {
        this.logger.info(`Fetching user with email: ${email}`);
        return await this.userRepository.findOne({ where: { identity: email } });
    }

    async create(userData: Partial<UserEntity>): Promise<UserEntity> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async countFollowedByUser(userId: string): Promise<number> {
        const count = await this.userFollowRepository.count({
            where: { follower: { id: userId } }, // Filter by the follower's userId
        });

        return count;
    }

    async countFollowerByUser(userId: string): Promise<number> {
        const count = await this.userFollowRepository.count({
            where: { followed: { id: userId } }, // Filter by the follower's userId
        });

        return count;
    }

    async checkFollowUser(followerId: string, followingId: string): Promise<UserFollowEntity | null> {
        const follow = await this.userFollowRepository.findOne({
            where: {
                follower: { id: followerId }, // Use the follower's id in the relation
                followed: { id: followingId } // Use the followed's id in the relation
            },
            relations: ['follower', 'followed'], // Ensure the relations are loaded
        });
        return follow;
    }

    async createFollowUser(userData: Partial<UserFollowEntity>): Promise<UserFollowEntity> {
        const result = this.userFollowRepository.create(userData);
        return this.userFollowRepository.save(result);
    }

    async removeFollowUser(userData: UserFollowEntity): Promise<UserFollowEntity> {
        const result = this.userFollowRepository.remove(userData);
        return result;
    }

    async followedByUser(userId: string, first: number, after?: string): Promise<UserEntity[]> {
        const whereCondition: any = {
            followers_users: { follower: { id: userId } }, // Filter by the userId in the follower relation
            is_active: true, // Only get active users
        };

        if (after) {
            whereCondition.id = MoreThan(after);
        }

        // Fetch followers
        const users = await this.userRepository.find({
            where: whereCondition,
            take: first + 1, // Take one extra to check if there's more for pagination
            relations: ['followers_users'], // Load the followers_users relation
        });

        return users;
    }
}
