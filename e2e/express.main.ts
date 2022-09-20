import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import { AsyncApiModule } from '../lib';
import { makeAsyncapiDocument } from './common';
import { Logger } from '@nestjs/common';

const port = 4001;
const host = '0.0.0.0';
const docRelPath = '/async-api';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const asyncapiDocument = await makeAsyncapiDocument(app);
  await AsyncApiModule.setup(docRelPath, app, asyncapiDocument);

  await app.listen(port, host);

  const baseUrl = `http://${host}:${port}`;
  Logger.log(`Server started at ${baseUrl}; AsyncApi at ${baseUrl + docRelPath};`, 'Bootstrap');
}

bootstrap();
