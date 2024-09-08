import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
    @Field()
    identity: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    device_type: string;

    @Field({ nullable: true })
    device_token: string;
}

@ObjectType({ isAbstract: true })
export class LoginResponse {
    @Field()
    access_token: string;

    @Field()
    refresh_token: string;
}
