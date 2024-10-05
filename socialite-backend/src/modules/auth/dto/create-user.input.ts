import { InputType, Field, Float, Int } from '@nestjs/graphql';

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
