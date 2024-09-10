import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { PostContentEntity } from './post_content.entity';
import { PostImageEntity } from './post_image.entity';
import { PostVideoEntity } from './post_video.entity';

@ObjectType()  // This decorator is used for GraphQL schema generation
@Entity({ name: 'posts' })
export class PostEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.posts)
    user: UserEntity;

    @Field({ nullable: true })  // Field exposed in GraphQL
    @Column({ type: 'text', nullable: true })
    desc?: string;

    @Field({ nullable: true })  // Field exposed in GraphQL
    @Column({ type: 'varchar', length: 255, nullable: true })
    tags?: string;

    @Field(() => Int)  // Field exposed in GraphQL
    @Column({ type: 'int', default: 0 })
    comments_count: number;

    @Field(() => Int)  // Field exposed in GraphQL
    @Column({ type: 'int', default: 0 })
    likes_count: number;

    @Field({ nullable: true })
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at?: Date;

    @Field(() => Date)  // Field exposed in GraphQL
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Field(() => Date)  // Field exposed in GraphQL
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Field(() => PostContentEntity, { nullable: true })
    @OneToOne(() => PostContentEntity, (postContent) => postContent.post, { cascade: true })  // One-to-One relation with PostContentEntity
    @JoinColumn()  // To specify that this entity owns the relationship
    postContent: PostContentEntity;

    @Field(() => [PostImageEntity])
    @OneToMany(() => PostImageEntity, (image) => image.post, { cascade: true })
    postImages?: PostImageEntity[];

    @Field(() => PostVideoEntity, { nullable: true })
    @OneToOne(() => PostVideoEntity, (video) => video.post, { cascade: true })
    @JoinColumn() // To specify that this entity owns the relationship
    postVideo?: PostVideoEntity;
}
