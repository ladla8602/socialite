// dto/pagination-args.dto.ts
import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { defaultValue: 10 }) // Limit the number of results to return
    first?: number;

    @Field(() => String, { nullable: true }) // Cursor for pagination
    after?: string;
}
