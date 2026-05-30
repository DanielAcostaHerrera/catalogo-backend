import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateSeriesInput {
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