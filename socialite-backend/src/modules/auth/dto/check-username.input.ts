import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length, Matches } from 'class-validator';

@InputType()
export class CheckUsernameInput {
    @Field()
    @IsString()
    @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
    // @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
    username: string;
}
