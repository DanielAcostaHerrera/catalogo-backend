import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { JuegosModule } from './juegos/juegos.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Conexión directa a MongoDB Atlas (hard‑code)
    MongooseModule.forRoot(
      'mongodb://danieldavidacostaherrera:Entrar020296@ac-des3zwn-shard-00-01.lg7n5tv.mongodb.net:27017/catalogo?tls=true&authSource=admin&directConnection=true'
    ),

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      csrfPrevention: false,
    }),

    // Carpeta estática de portadas
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'portadas'),
      serveRoot: '/portadas',
    }),

    JuegosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

