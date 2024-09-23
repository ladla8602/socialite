import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { TagEntity } from './tag.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('post_tags')
export class PostTagEntity {
    @Field()
    @PrimaryColumn()
    postId: string;

    @Field()
    @PrimaryColumn()
    tagId: string;

    @Field(() => PostEntity)
    @ManyToOne(() => PostEntity, post => post.postTags)
    @JoinColumn({ name: 'postId' })
    post: PostEntity;

    @Field(() => TagEntity)
    @ManyToOne(() => TagEntity, tag => tag.postTags)
    @JoinColumn({ name: 'tagId' })
    tag: TagEntity;
}
