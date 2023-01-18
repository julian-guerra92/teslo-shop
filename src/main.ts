import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  //Configuración para crear la documentación del proyecto
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTful API')
    .setDescription('Teslo shop ednpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running on port: ${process.env.PORT} and from Digital Ocean`);

}
bootstrap();


/*
Se configura la aplicación para generar documentación del proyecto. Para esto, tener en cuenta el enlace de la página oficial: 

  - https://docs.nestjs.com/openapi/introduction

Para su visualización, se utiliza en endpoint http://localhost:3000/api
*/