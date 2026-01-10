import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir carpeta de portadas
  app.useStaticAssets('/opt/render/project/src/portadas', {
    prefix: '/portadas/',
  });
  await app.listen(3000);
}
bootstrap();
