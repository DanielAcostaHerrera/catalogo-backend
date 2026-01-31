import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { JuegosModule } from './juegos/juegos.module';
import { SeriesModule } from './series/series.module'; // 👈 añadimos el módulo de series
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PreciosController } from './precios/precios.controller'; // 👈 importamos el controlador

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      csrfPrevention: false,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'portadas'),
      serveRoot: '/portadas',
    }),

    JuegosModule,
    SeriesModule, // 👈 aquí lo añadimos
  ],
  controllers: [AppController, PreciosController],
  providers: [AppService],
})
export class AppModule { }
