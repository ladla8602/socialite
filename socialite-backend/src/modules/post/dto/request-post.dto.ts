import { InputType, Field, ObjectType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => Int)
  content_type: number;

  @Field()
  content: string;

  @Field({ nullable: true })
  hashTags: string;

  @Field({ nullable: true })
  visibility: string;

  @Field({ nullable: true })
  is_processing: boolean;

}

@InputType()
export class CreateCommentInput {
  @Field()
  content: string;

  @Field()
  postId: string;
}

@InputType()
export class SuggestPostContentInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Content can\'t be empty' })
  content: string;

  @Field()
  @IsString()
  tone: string;
}
