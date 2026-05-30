import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAnimadoInput {
    @Field(() => Int)
    Id: number;

    @Field({ nullable: true })
    Titulo?: string;

    @Field(() => Int, { nullable: true })
    Temporadas?: number;

    @Field({ nullable: true })
    Episodios?: string;

    @Field({ nullable: true })
    Sinopsis?: string;

    @Field({ nullable: true })
    Portada?: string;

    @Field(() => Int, { nullable: true })
    Anno?: number;
}