import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUsuarioInput {
    @Field()
    Usuario: string;

    @Field()
    Password: string;

    @Field()
    Rol: string;
}