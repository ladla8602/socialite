import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from '../auth/dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { UserMessage } from './constants/user.message';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async findOneByIdentity(identity: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOneByIdentity(identity);
            if (!user) {
                throw new Error(UserMessage.USER_NOT_FOUND);
            }
            return user;
        } catch (error: unknown) {
            throw error;
        }
    }

    async findOneById(id: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOne({ id });
            if (!user) {
                throw new Error(UserMessage.USER_NOT_FOUND);
            }
            return user;
        } catch (error: unknown) {
            throw error;
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
}
