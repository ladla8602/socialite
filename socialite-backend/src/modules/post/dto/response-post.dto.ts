import { Field, ObjectType } from "@nestjs/graphql";
import { PostEntity } from "../entities/post.entity";
import { PageInfo } from "src/common/dto/pagination.dto";

@ObjectType()
export class PaginatedPost {
  @Field(() => [PostEntity])
  edges: PostEntity[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

}
