import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { PostTagEntity } from './post_tag.entity';
import { PostImageEntity } from './post_image.entity';
import { PostVideoEntity } from './post_video.entity';
import { PostCommentEntity } from './post_comment.entity';
import { PostLikeEntity } from './post_like.entity';
import { Expose } from 'class-transformer';
import { TagEntity } from './tag.entity';

@ObjectType()  // This decorator is used for GraphQL schema generation
@Entity({ name: 'posts' })
export class PostEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => UserEntity)
    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.posts)
    user: UserEntity;

    @Field(() => Boolean)
    @Column({ type: 'boolean', default: true })
    is_active?: boolean;

    @Field(() => Int)
    @Column({ type: 'tinyint', comment: 'image = 1, video = 2' })
    content_type: number;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    content: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbnail?: string;

    @Field({ nullable: true })
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at?: Date;

    @Field(() => Date)  // Field exposed in GraphQL
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Field(() => Date)  // Field exposed in GraphQL
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Field(() => [PostImageEntity], { nullable: true })
    @OneToMany(() => PostImageEntity, (image) => image.post, { cascade: true })
    postImages?: PostImageEntity[];

    @Field(() => PostVideoEntity, { nullable: true })
    @OneToOne(() => PostVideoEntity, (video) => video.post, { cascade: true })
    postVideo?: PostVideoEntity;

    @OneToMany(() => PostTagEntity, postTags => postTags.post)
    postTags?: PostTagEntity[];

    @OneToMany(() => PostCommentEntity, comment => comment.post)
    comments?: PostCommentEntity[];

    @OneToMany(() => PostLikeEntity, like => like.post)
    likes?: PostLikeEntity[];

    @Field(() => [TagEntity], { nullable: true })
    tags: TagEntity[];

    @Field(() => Int, { defaultValue: 0 })
    commentsCount: number;

    @Field(() => Int, { defaultValue: 0 })
    likesCount: number;
}
