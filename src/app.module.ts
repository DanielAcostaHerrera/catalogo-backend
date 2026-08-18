import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { JuegosModule } from './juegos/juegos.module';
import { SeriesModule } from './series/series.module';
import { AnimadosModule } from './animados/animados.module';
import { AnimesModule } from './animes/animes.module';
import { UsuariosModule } from './usuarios/usuarios.module'; // 👈 añadido
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PreciosController } from './precios/precios.controller';
import * as jwt from 'jsonwebtoken';
import { AuthContext } from './usuarios/usuarios.context'; 
import { Request } from 'express'; 

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      csrfPrevention: false,
      context: ({ req }: { req: Request }): AuthContext => {
        const auth = req.headers.authorization || '';
        const token = auth.replace('Bearer ', '');
        try {
          const user = jwt.verify(token, 'clave-super-segura') as any;
          return { user };
        } catch {
          return {};
        }
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'portadas'),
      serveRoot: '/portadas',
    }),

    JuegosModule,
    SeriesModule,
    AnimadosModule,
    AnimesModule,
    UsuariosModule, 
  ],
  controllers: [AppController, PreciosController],
  providers: [AppService],
})
export class AppModule {}


