import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CrearJuegoInput {
    @Field()
    Nombre: string;

    @Field(() => Int)
    Tamano: number;

    @Field(() => Int, { nullable: true })
    AnnoAct?: number;

    @Field({ nullable: true })
    Portada?: string;

    @Field({ nullable: true })
    Sinopsis?: string;

    @Field({ nullable: true })
    Requisitos?: string;
}