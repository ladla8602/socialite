import { Int, PartialType } from "@nestjs/graphql";
import { Field } from "@nestjs/graphql/dist/decorators/field.decorator";
import { InputType } from "@nestjs/graphql/dist/decorators/input-type.decorator";
import { CreateUserInput } from "../../auth/dto/request-auth.dto";

@InputType()
export class UserUpdateDto {
  @Field()
  full_name: string;

  @Field()
  username: string;

  @Field()
  bio: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;
}

