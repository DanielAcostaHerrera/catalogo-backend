import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAnimeInput {
    @Field(() => Int)
    Id: number; // se usa para localizar el anime a actualizar

    @Field({ nullable: true })
    Titulo?: string;

    @Field(() => Int, { nullable: true })
    Temporadas?: number;

    @Field({ nullable: true })
    Episodios?: string;

    @Field({ nullable: true })
    Sinopsis?: string;

    @Field({ nullable: true })
    Portada?: string; // nombre del archivo en /portadas

    @Field(() => Int, { nullable: true })
    Anno?: number;
}