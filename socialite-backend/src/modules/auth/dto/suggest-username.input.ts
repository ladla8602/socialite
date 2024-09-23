import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

@InputType()
export class SuggestUsernameInput {
    @Field()
    @IsString()
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name: string;

    @Field()
    @IsString()
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;
}
