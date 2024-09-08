import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne } from 'typeorm';
import { PostEntity } from './post.entity';  // Assuming PostEntity is defined in the same folder

@ObjectType()  // GraphQL decorator
@Entity('post_contents')  // Table name in MySQL
export class PostContentEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Int)
    @Column({ type: 'int' })
    post_id: number;

    @Field(() => Int)
    @Column({ type: 'tinyint', comment: 'image = 0, video = 1' })
    content_type: number;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    content: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbnail?: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToOne(() => PostEntity, (post) => post.content)  // One-to-One relation with PostEntity
    post: PostEntity;
}
