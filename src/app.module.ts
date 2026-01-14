import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JuegosModule } from './juegos/juegos.module';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'catalogo.db'), // ruta relativa y portable
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // MUY IMPORTANTE: no tocar tu base real
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,       // 🔑 habilita introspección en producción
      persistedQueries: false,   // 🔑 desactiva persisted queries (evita la advertencia de Apollo)
    }),
    JuegosModule,
  ],
  controllers: [AppController],   // 👈 aquí registras el controlador
  providers: [AppService],
})
export class AppModule { }

