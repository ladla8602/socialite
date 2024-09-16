import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length, Matches, IsEmail } from 'class-validator';

@InputType()
export class CheckEmailInput {
    @Field()
    @IsString()
    @Length(3, 20, { message: 'Email must be between 3 and 20 characters' })
    @IsEmail()
    email: string;
}
