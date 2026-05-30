import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimadosService } from './animados.service';
import { AnimadosResolver } from './animados.resolver';
import { Animados, AnimadosSchema } from './animados.schema';
import { Counter, CounterSchema } from '../juegos/counter.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Animados.name, schema: AnimadosSchema },
            { name: Counter.name, schema: CounterSchema },
        ]),
    ],
    providers: [AnimadosService, AnimadosResolver],
})
export class AnimadosModule { }