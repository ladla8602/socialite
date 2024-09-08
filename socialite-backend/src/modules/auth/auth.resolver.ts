import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { PubSub } from 'graphql-subscriptions';
import { LoginInput, LoginResponse } from './dto/login.input';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from '../user/user.service';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly pubSub: PubSub,
        private readonly logger: PinoLogger,
    ) { }

    @Mutation(() => LoginResponse)
    async login(
        @Args('loginInput') loginInput: LoginInput
    ) {
        try {
            const user = await this.authService.validateUser(loginInput);
            const response = await this.authService.login(user);
            return response;
        } catch (error) {
            // Handle and log the error appropriately
            this.logger.error('Error during login mutation', error);
            throw error;
        }
    }

    @Mutation(() => LoginResponse)
    async refreshToken(
        @Args('refreshToken') refreshToken: string,
    ) {
        const newAccessToken = await this.authService.refresh(refreshToken);
        return newAccessToken;
    }

    @Mutation(() => UserEntity)
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        try {
            const user = this.userService.create(createUserInput);
            return user;
        } catch (error) {
            // Handle and log the error appropriately
            this.logger.error('Error during createUser mutation', error);
            throw error;
        }
    }
}
