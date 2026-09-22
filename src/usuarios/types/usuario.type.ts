import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UsuarioType {
    @Field(() => Int)
    Id: number;

    @Field()
    Usuario: string;

    @Field()
    Rol: string;
}