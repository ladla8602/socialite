import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('post_likes')
export class PostLikeEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Date)
    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => PostEntity, post => post.likes)
    post: PostEntity;

    @ManyToOne(() => UserEntity, user => user.likes)
    user: UserEntity;
}
