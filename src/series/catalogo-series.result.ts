import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SeriesType } from './types/series.type';

@ObjectType()
export class CatalogoSeriesResult {
    @Field(() => [SeriesType])
    series: SeriesType[];

    @Field(() => Int)
    total: number;
}