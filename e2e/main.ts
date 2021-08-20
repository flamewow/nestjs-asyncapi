import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './src/app.module';

import { AsyncApiModule } from '@lib';

const port = 4001;
const host = '0.0.0.0';
const docRelPath = '/async-api';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await AsyncApiModule.setup(docRelPath, app, {
    // sidebarOrganization: 'byTags',
  });

  return app.listen(port, host);
}

const baseUrl = `http://${host}:${port}`;
const startMessage = `Server started at ${baseUrl}; AsyncApi at ${baseUrl + docRelPath};`;

bootstrap().then(() => console.log(startMessage));
