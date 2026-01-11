import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar CORS para permitir peticiones desde tu frontend (Vite en localhost:5173 y Render)
  app.enableCors({
    origin: '*', // o pon aquí la URL de tu frontend si quieres restringir
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Servir carpeta de portadas (funciona en local y en Render)
  app.useStaticAssets(join(__dirname, '..', 'portadas'), {
    prefix: '/portadas/',
  });

  // Usar el puerto asignado por Render o 3000 en local
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
