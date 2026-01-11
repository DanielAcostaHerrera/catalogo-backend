import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Juego } from './juegos.entity';

@ObjectType()
export class CatalogoResult {
    @Field(() => [Juego])
    juegos: Juego[];

    @Field(() => Int)
    total: number;
}