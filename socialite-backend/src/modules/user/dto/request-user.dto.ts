import { Int, PartialType } from "@nestjs/graphql";
import { Field } from "@nestjs/graphql/dist/decorators/field.decorator";
import { InputType } from "@nestjs/graphql/dist/decorators/input-type.decorator";
import { CreateUserInput } from "src/modules/auth/dto/create-user.input";

@InputType()
export class UserUpdateDto {
  @Field()
  full_name: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  identity?: string;

  @Field()
  bio: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;
}

