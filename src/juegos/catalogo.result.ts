import { ObjectType, Field, Int } from '@nestjs/graphql';
import { JuegoType } from './juego.type';

@ObjectType()
export class CatalogoResult {
    @Field(() => [JuegoType])
    juegos: JuegoType[];

    @Field(() => Int)
    total: number;
}