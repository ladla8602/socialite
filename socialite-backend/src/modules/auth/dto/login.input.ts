import { InputType, Field, ObjectType } from '@nestjs/graphql';
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

@ObjectType({ isAbstract: true })
export class LoginResponse {
    @Field()
    access_token: string;

    @Field()
    refresh_token: string;

    @Field(() => UserEntity, { nullable: true })
    user?: UserEntity;
}
