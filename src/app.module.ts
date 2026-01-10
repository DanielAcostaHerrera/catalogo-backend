import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JuegosModule } from './juegos/juegos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'catalogo.db',   // tu base real
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,        // MUY IMPORTANTE: NO tocar tu base real
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    JuegosModule, 
  ],
})
export class AppModule {}

