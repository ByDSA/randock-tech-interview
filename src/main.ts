import helmet from "helmet";

import { INestApplication, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { addRequestDataValidationTo } from "./utils";

const APP_ROUTE_PREFIX = "api";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix(APP_ROUTE_PREFIX);

  app.use(helmet());

  addRequestDataValidationTo(app);

  addVersioningTo(app);

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

  SwaggerModule.setup(`${APP_ROUTE_PREFIX}/:version/docs`, app, document);
}

function addVersioningTo(app: INestApplication) {
  app.enableVersioning( {
    type: VersioningType.URI,
    defaultVersion: "1",
  } );
}
