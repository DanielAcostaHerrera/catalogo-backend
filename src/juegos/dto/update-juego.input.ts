import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CrearJuegoInput } from './create-juego.input';
@InputType()
export class ActualizarJuegoInput extends PartialType(CrearJuegoInput) {
    @Field(() => Int)
    Id: number;

    @Field({ nullable: true })
    Nombre?: string;

    @Field({ nullable: true })
    Tamano?: number;

    @Field({ nullable: true })
    AnnoAct?: number;

    @Field({ nullable: true })
    Portada?: string; // nombre del archivo en /portadas

    @Field({ nullable: true })
    Sinopsis?: string;

    @Field({ nullable: true })
    Requisitos?: string;
}