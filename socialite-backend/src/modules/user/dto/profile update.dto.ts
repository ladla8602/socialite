import { Field } from "@nestjs/graphql/dist/decorators/field.decorator";
import { InputType } from "@nestjs/graphql/dist/decorators/input-type.decorator";

@InputType()
export class UserUpdateDto {
    @Field()
    full_name: string;

    @Field()
    username: string;

    @Field({ nullable: true })
    identity?: string;

    @Field()
    bio: string;

}