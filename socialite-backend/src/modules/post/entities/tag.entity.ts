import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PostTagEntity } from './post_tag.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('tags')
export class TagEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Field(() => [PostTagEntity], { nullable: true })
    @OneToMany(() => PostTagEntity, postTags => postTags.tag)
    postTags?: PostTagEntity[];
}
