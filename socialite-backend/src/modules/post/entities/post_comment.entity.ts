import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from '../../../modules/user/entities/user.entity';

@ObjectType()
@Entity('post_comments')
export class PostCommentEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ type: 'text' })
    content: string;

    @Field(() => Date)
    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => PostEntity, (post) => post.comments)
    post: PostEntity;

    @ManyToOne(() => UserEntity, (user) => user.comments)
    user: UserEntity;
}
