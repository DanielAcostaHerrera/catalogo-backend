import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir carpeta de portadas (funciona en local y en Render)
  app.useStaticAssets(join(__dirname, '..', 'portadas'), {
    prefix: '/portadas/',
  });

  await app.listen(3000);
}
bootstrap();
