import { InputType, Field, ObjectType, Int, Float } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@InputType()
export class LoginInput {
  @Field()
  identity: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  device_type: number;

  @Field({ nullable: true })
  device_token: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  identity: string;

  @Field()
  full_name: string;

  @Field()
  password: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  google_id: string;

  @Field(() => Int)
  device_type: number;

  @Field({ nullable: true })
  device_token?: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;
}


@InputType()
export class CheckUsernameInput {
  @Field()
  @IsString()
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  // @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
  username: string;
}

@InputType()
export class CheckEmailInput {
  @Field()
  @IsString()
  @Length(3, 255, { message: 'Email must be between 3 and 20 characters' })
  @IsEmail()
  email: string;
}

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

