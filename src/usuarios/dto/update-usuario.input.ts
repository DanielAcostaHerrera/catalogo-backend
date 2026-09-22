import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUsuarioInput {
    @Field(() => Int)
    Id: number;

    @Field({ nullable: true })
    Usuario?: string;

    @Field({ nullable: true })
    Password?: string;

    @Field({ nullable: true })
    Rol?: string;
}