import { Field, ObjectType } from "@nestjs/graphql";
import { PageInfo } from "src/common/dto/pagination.dto";
import { UserEntity } from "../entities/user.entity";

@ObjectType()
export class PaginatedUser {
  @Field(() => [UserEntity])
  edges: UserEntity[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
