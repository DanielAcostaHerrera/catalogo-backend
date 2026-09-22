import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './usuarios.schema';
import { UsuariosService } from './usuarios.service';
import { UsuariosResolver } from './usuarios.resolver';
import { Counter, CounterSchema } from 'src/juegos/counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  providers: [UsuariosService, UsuariosResolver],
})
export class UsuariosModule {}
