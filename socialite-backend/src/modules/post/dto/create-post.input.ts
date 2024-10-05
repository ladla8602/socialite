import { InputType, Field, ObjectType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
    @Field(() => Int)
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
