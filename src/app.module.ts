import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { JuegosModule } from './juegos/juegos.module';
import { SeriesModule } from './series/series.module';
import { AnimadosModule } from './animados/animados.module';
import { AnimesModule } from './animes/animes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PreciosController } from './precios/precios.controller';

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
    SeriesModule,
    AnimadosModule,
    AnimesModule,
  ],
  controllers: [AppController, PreciosController],
  providers: [AppService],
})
export class AppModule { }
