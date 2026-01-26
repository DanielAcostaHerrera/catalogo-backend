import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class JuegoType {
    @Field(() => Int)
    Id: number;

    @Field()
    Nombre: string;

    @Field()
    Tamano: number;

    @Field(() => Int, { nullable: true })
    AnnoAct: number;

    @Field({ nullable: true })
    Portada: string;

    @Field({ nullable: true })
    Sinopsis: string;

    @Field({ nullable: true })
    Requisitos: string;

    @Field(() => Int)
    Precio: number;

    @Field()
    TamanoFormateado: string;
}