import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar CORS para permitir peticiones desde tu frontend (Vite en localhost:5173 y Render)
  app.enableCors({
    origin: '*', // o pon aquí la URL de tu frontend si quieres restringir
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Usar el puerto asignado por Render o 3000 en local
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
