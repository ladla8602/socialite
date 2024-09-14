import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
    @Field()
    content_type: number;

    @Field()
    content: string;

    @Field({ nullable: true })
    hashTags: string;
}

@InputType()
export class CreateCommentInput {
    @Field()
    content: string;

    @Field()
    postId: string;

}
