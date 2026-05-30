import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JuegosService } from './juegos.service';
import { JuegosResolver } from './juegos.resolver';
import { Juego, JuegoSchema } from './juegos.schema';
import { Counter, CounterSchema } from './counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Juego.name, schema: JuegoSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  providers: [JuegosService, JuegosResolver],
})
export class JuegosModule { }