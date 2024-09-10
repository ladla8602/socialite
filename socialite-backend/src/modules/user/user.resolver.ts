import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserInput } from '../auth/dto/create-user.input';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly pubSub: PubSub,
    ) { }

    @Query(() => [UserEntity])
    @UseGuards(JwtAuthGuard)
    async users(@Context() context: any) {
        console.log(context.req.user)
        return await this.userService.findAll();
    }
}
