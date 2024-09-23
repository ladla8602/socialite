import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSub } from 'graphql-subscriptions';
import { UserFollowEntity } from './entities/user_follow.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserFollowEntity]),
    ],
    controllers: [UserController],
    providers: [UserService, UserResolver, UserRepository, PubSub],
    exports: [UserService, UserRepository]
})
export class UserModule { }
