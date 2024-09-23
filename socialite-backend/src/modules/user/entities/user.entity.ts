import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { EntityRelationalHelper } from '../../../utils/relation-entity-helper';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, Unique, BeforeInsert, BeforeUpdate, OneToMany, DeleteDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { PostEntity } from '../../post/entities/post.entity';
import { PostCommentEntity } from '../../../modules/post/entities/post_comment.entity';
import { PostLikeEntity } from '../../../modules/post/entities/post_like.entity';
import { UserFollowEntity } from './user_follow.entity';

@ObjectType()
@Entity({ name: 'users' })
export class UserEntity extends EntityRelationalHelper {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Index({ unique: true })
    @Column({ type: 'varchar', length: 255 })
    identity: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    @Field()
    @Index({ unique: true })
    @Column({ type: 'varchar', length: 30 })
    username: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 100, nullable: true })
    full_name?: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    bio?: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    profile?: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    background_image?: string;

    @Field(() => Int)
    @Column({ type: 'tinyint', default: 1, comment: '0 = not push notification, 1 = Push notification' })
    is_push_notifications: number;

    @Field(() => Int)
    @Column({ type: 'tinyint', default: 1, comment: '0 = Not invited to room publicly, 1 = Able to invite in room publicly' })
    is_invited_to_room: number;

    @Field(() => Int)
    @Column({ type: 'tinyint', default: 0, comment: '0 = notVerified, 1 = verificationInPending, 2 = verified' })
    is_verified: number;

    @Field()
    @Column({ type: 'boolean', default: false, comment: 'false = Unblock, true = Block' })
    is_block: boolean;

    @Field()
    @Column({ type: 'boolean', default: true, comment: 'false = Inavtive, true = Active' })
    is_active: boolean;

    @Field(() => [String], { nullable: true })
    @Column('json', { nullable: true })
    block_user_ids?: string[];

    @Field(() => Int, { nullable: true })
    @Column({ type: 'tinyint', nullable: true, comment: '0 = Google login, 1 = Apple Login, 2 = Email login, 3 = Phone login' })
    login_type?: number;

    @Field(() => Int)
    @Column({ type: 'tinyint', comment: '1 = Android, 2 = iOS' })
    device_type: number;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    device_token?: string;

    @Field(() => Float, { nullable: true })
    @Column({ type: 'float', nullable: true })
    latitude?: number;

    @Field(() => Float, { nullable: true })
    @Column({ type: 'float', nullable: true })
    longitude?: number;

    @Field({ nullable: true })
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at?: Date;

    @Field()
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Field()
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Field(() => [PostEntity], { nullable: true })
    @OneToMany(() => PostEntity, (post) => post.user, { nullable: true })
    posts?: PostEntity[];

    @Field(() => [PostCommentEntity], { nullable: true })
    @OneToMany(() => PostCommentEntity, comment => comment.user, { nullable: true })
    comments?: PostCommentEntity[];

    @Field(() => [PostLikeEntity], { nullable: true })
    @OneToMany(() => PostLikeEntity, like => like.user, { nullable: true })
    likes?: PostLikeEntity[];

    @Field(() => [UserFollowEntity], { nullable: true })
    @OneToMany(() => UserFollowEntity, (follow) => follow.follower, { nullable: true })
    following_users?: UserFollowEntity[];

    @Field(() => [UserFollowEntity], { nullable: true })
    @OneToMany(() => UserFollowEntity, (follow) => follow.followed, { nullable: true })
    followers_users?: UserFollowEntity[];
}
