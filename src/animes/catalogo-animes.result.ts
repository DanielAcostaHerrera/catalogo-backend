import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AnimeType } from './types/animes.type';

@ObjectType()
export class CatalogoAnimesResult {
    @Field(() => [AnimeType])
    animes: AnimeType[];

    @Field(() => Int)
    total: number;
}