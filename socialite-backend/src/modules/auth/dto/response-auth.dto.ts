import { Field, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "src/modules/user/entities/user.entity";

@ObjectType({ isAbstract: true })
export class LoginResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;
}