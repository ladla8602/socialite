import { Resolver, Mutation, Args, Query, ObjectType } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { PubSub } from 'graphql-subscriptions';
import { HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { OpenAiService } from 'src/common/services/openai.service';
import { LoginInput, CreateUserInput, CheckUsernameInput, CheckEmailInput, SuggestUsernameInput } from './dto/request-auth.dto';
import { LoginResponse } from './dto/response-auth.dto';

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

    @Mutation(() => LoginResponse)
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        try {
            const user = await this.userService.create(createUserInput);
            const response = await this.authService.login(user);
            return response;
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

    @Query(() => Boolean)
    @UsePipes(new ValidationPipe({ transform: true }))
    async checkEmailExists(
        @Args('checkEmailInput') checkEmailInput: CheckEmailInput,
    ) {
        const { email } = checkEmailInput;
        try {
            const user = await this.userService.findOneByEmail(email);
            if (user) {
                return true;
            }
            return false;
        } catch (error) {
            this.logger.error('Error during checkEmailExists query', error);
            throw error;
        }
    }

    @Mutation(() => LoginResponse, { nullable: true })
    async googleLogin(@Args('googleToken') googleToken: string, @Args('deviceToken') deviceToken?: string) {
        try {
            const userData = await this.authService.verifyGoogleToken(googleToken, deviceToken);

            if (!userData) {
                return null;  // Return null if no user is found
            }

            return userData;  // Return JWT token if user exists
        } catch (error) {
            this.logger.error('Error during googleLogin mutation', error);
            throw error;
        }
    }
}
