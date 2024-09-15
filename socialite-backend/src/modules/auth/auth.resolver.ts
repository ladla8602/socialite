import { Resolver, Mutation, Args, Query, ObjectType } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { PubSub } from 'graphql-subscriptions';
import { LoginInput, LoginResponse } from './dto/login.input';
import { HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from '../user/user.service';
import { OpenAiService } from 'src/common/services/openai.service';
import { CheckUsernameInput } from './dto/check-username.input';
import { SuggestUsernameInput } from './dto/suggest-username.input';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly openaiService: OpenAiService,
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

    @Query(() => Boolean)
    @UsePipes(new ValidationPipe({ transform: true }))
    async checkUsernameExists(
        @Args('checkUsernameInput') checkUsernameInput: CheckUsernameInput,
    ) {
        const { username } = checkUsernameInput;
        try {
            return await this.userService.findOneByUsername(username);
        } catch (error) {
            this.logger.error('Error during checkUsername query', error);
            throw error;
        }
    }

    @Query(() => String)
    async suggestUsername(
        @Args('suggestUsernameInput') suggestUsernameInput: SuggestUsernameInput
    ) {
        const { name, email } = suggestUsernameInput;
        try {
            return await this.openaiService.generateUsername(name, email);
        } catch (error) {
            this.logger.error('Error during suggestUsername query', error);
            throw error;
        }
    }
}
