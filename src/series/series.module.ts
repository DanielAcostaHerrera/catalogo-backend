import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeriesService } from './series.service';
import { SeriesResolver } from './series.resolver';
import { Series, SeriesSchema } from './series.schema';
import { Counter, CounterSchema } from '../juegos/counter.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Series.name, schema: SeriesSchema },
            { name: Counter.name, schema: CounterSchema },
        ]),
    ],
    providers: [SeriesService, SeriesResolver],
})
export class SeriesModule { }