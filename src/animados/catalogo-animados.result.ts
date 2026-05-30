import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AnimadosType } from './types/animados.type';

@ObjectType()
export class CatalogoAnimadosResult {
    @Field(() => [AnimadosType])
    series: AnimadosType[];

    @Field(() => Int)
    total: number;
}