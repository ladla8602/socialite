import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { PostContentEntity } from './post_content.entity';

@ObjectType()  // This decorator is used for GraphQL schema generation
@Entity({ name: 'posts' })
export class PostEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Int)  // Foreign key to the User entity
    @Column({ type: 'int' })
    user_id: number;

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

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.posts)
    user: UserEntity;

    @Field(() => PostContentEntity, { nullable: true })
    @OneToOne(() => PostContentEntity, (postContent) => postContent.post, { cascade: true })  // One-to-One relation with PostContentEntity
    @JoinColumn()  // To specify that this entity owns the relationship
    content: PostContentEntity;
}
