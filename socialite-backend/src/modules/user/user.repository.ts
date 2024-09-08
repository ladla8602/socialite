import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { ID } from '@nestjs/graphql';

@Injectable()
export class UserRepository {
    constructor(
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

    async findOne(fields: EntityCondition<UserEntity>): Promise<NullableType<UserEntity>> {
        const user = await this.userRepository.findOne({
            where: fields as unknown as FindOptionsWhere<UserEntity>,
        });
        return user;
    }

    async findOneByIdentity(identity: string): Promise<UserEntity | undefined> {
        this.logger.info(`Fetching user with identity: ${identity}`);
        try {
            return await this.userRepository.findOne({ where: { identity } });
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
