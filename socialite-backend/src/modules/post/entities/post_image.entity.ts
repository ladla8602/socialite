import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PostEntity } from './post.entity';

@ObjectType()
@Entity('post_images')
export class PostImageEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PostEntity, (post) => post.postImages)
    post: PostEntity;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    mime_type: string;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    image_url: string;
}
