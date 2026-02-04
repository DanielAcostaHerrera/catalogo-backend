import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimesService } from './animes.service';
import { AnimesResolver } from './animes.resolver';
import { Anime, AnimeSchema } from './animes.schema';
import { Counter, CounterSchema } from '../juegos/counter.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Anime.name, schema: AnimeSchema },
            { name: Counter.name, schema: CounterSchema },
        ]),
    ],
    providers: [AnimesService, AnimesResolver],
})
export class AnimesModule { }