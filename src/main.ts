import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  addInputDataValidationTo(app);

  addSwaggerTo(app);

  // Run
  await app.listen(3000);
}
bootstrap();

function addSwaggerTo(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Fuelstation Finder API")
    .setDescription("Fuelstation Finder API")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);
}

function addInputDataValidationTo(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe( {
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // 422
    transform: true, // Para convertir el tipo de fuel a uppercase
    enableDebugMessages: true, // Para ver los mensajes de error
  } ));
}
