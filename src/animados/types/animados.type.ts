import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AnimadosType {
    @Field(() => Int)
    Id: number;

    @Field()
    Titulo: string;

    @Field(() => Int)
    Temporadas: number;

    @Field()
    Episodios: string;

    @Field()
    Sinopsis: string;

    @Field()
    Portada: string;

    @Field(() => Int)
    Anno: number;
}