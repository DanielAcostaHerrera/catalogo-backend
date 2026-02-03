import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateAnimadoInput {
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