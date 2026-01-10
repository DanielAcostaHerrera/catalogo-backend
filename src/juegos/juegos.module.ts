import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Juego } from './juegos.entity';
import { JuegosService } from './juegos.service';
import { JuegosResolver } from './juegos.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Juego])],
  providers: [JuegosService, JuegosResolver],
})
export class JuegosModule {}