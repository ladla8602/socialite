import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@ObjectType()
@Entity({ name: 'user_follows' })
export class UserFollowEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.followers_users, { onDelete: 'CASCADE' })
    follower: UserEntity;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.following_users, { onDelete: 'CASCADE' })
    followed: UserEntity;

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
