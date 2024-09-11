import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@ObjectType()
@Entity('post_images')
export class PostImageEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Boolean)
    @Column({ type: 'boolean', default: false })
    is_active?: boolean;

    @ManyToOne(() => PostEntity, (post) => post.postImages)
    @JoinColumn()
    post: PostEntity;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    image_url: string;

    @Field(() => Date)
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
