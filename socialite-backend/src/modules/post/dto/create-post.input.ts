import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
    @Field()
    content_type: number;

    @Field()
    content: string;

    @Field({ nullable: true })
    tags: string;
}
