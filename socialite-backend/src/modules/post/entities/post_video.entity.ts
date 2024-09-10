import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Unique } from 'typeorm';
import { PostEntity } from './post.entity';

@ObjectType()
@Entity('post_videos')
export class PostVideoEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PostEntity, (post) => post.postVideo)
    post: PostEntity;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    mime_type: string;

    @Field()
    @Column({ type: 'varchar', length: 255 })
    media_url: string;
}
