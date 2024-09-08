import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { Cache } from 'cache-manager';

@Injectable()
export class UserRepository {
    constructor(
        @Inject('CACHE_MANAGER') private cacheManager: Cache,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UserRepository.name);
    }

    async findAll(): Promise<UserEntity[] | undefined> {
        this.logger.info(`Fetching all users`);
        return await this.userRepository.find();
    }

    async findOne(fields: EntityCondition<UserEntity>): Promise<UserEntity | null> {
        const cacheKey = `user-${JSON.stringify(fields)}`;

        this.logger.info(`Fetching user with conditions: ${JSON.stringify(fields)}`);

        try {
            // Attempt to get the data from the cache
            let user = await this.cacheManager.get<UserEntity>(cacheKey);

            if (user) {
                this.logger.info(`Cache hit for conditions: ${JSON.stringify(fields)}`);
                return user;
            }

            this.logger.info(`Cache miss for conditions: ${JSON.stringify(fields)}. Fetching from database.`);

            // Fetch from the database.
            user = await this.userRepository.findOne({
                where: fields as unknown as FindOptionsWhere<UserEntity>,
            });

            if (user) {
                // Store the result in the cache with a TTL
                await this.cacheManager.set(cacheKey, user, 300);
            }

            return user;
        } catch (error) {
            this.logger.error(`Error fetching user with conditions: ${JSON.stringify(fields)}`, error);
            throw new Error('Could not fetch user');
        }
    }

    async findOneByIdentity(identity: string): Promise<UserEntity | undefined> {
        this.logger.info(`Fetching user with identity: ${identity}`);

        const cacheKey = `user-${identity}`;

        try {
            // Attempt to get the data from the cache
            let user = await this.cacheManager.get<UserEntity>(cacheKey);

            if (user) {
                this.logger.info(`Cache hit for identity: ${identity}`);
                return user;
            }

            this.logger.info(`Cache miss for identity: ${identity}. Fetching from database.`);

            // Fetch from the database
            user = await this.userRepository.findOne({ where: { identity } });

            if (user) {
                // Store the result in the cache with a TTL
                await this.cacheManager.set(cacheKey, user, 300);
            }

            return user;
        } catch (error) {
            this.logger.error(`Error fetching user with identity: ${identity}`, error);
            throw new Error('Could not fetch user');
        }
    }

    async findOneByUsername(username: string): Promise<UserEntity | undefined> {
        this.logger.info(`Fetching user with username: ${username}`);
        try {
            return await this.userRepository.findOne({ where: { username: username } });
        } catch (error) {
            this.logger.error(`Error fetching user with username: ${username}`, error);
            throw new Error('Could not fetch user');
        }
    }

    async create(userData: Partial<UserEntity>): Promise<UserEntity> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
}
