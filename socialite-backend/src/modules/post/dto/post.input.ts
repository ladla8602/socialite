import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class PostInput {
    @Field()
    content_type: number;

    @Field()
    content: string;

    @Field({ nullable: true })
    tags: string;
}

@ObjectType({ isAbstract: true })
export class PostResponse {
    @Field()
    access_token: string;

    @Field()
    refresh_token: string;
}
