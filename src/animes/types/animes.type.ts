import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AnimeType {
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
    Portada: string; // nombre del archivo en /portadas

    @Field(() => Int)
    Anno: number;
}