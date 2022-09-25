import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import { AsyncApiModule } from '../lib';
import { makeAsyncapiDocument } from './common';
import { INestApplication, Logger } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { BOOTSTRAP, DOC_RELATIVE_PATH, HOST, PORT } from './constants';

const USE_FASTIFY = false;

const adapter = USE_FASTIFY
  ? new FastifyAdapter({
      ignoreTrailingSlash: false,
    })
  : new ExpressAdapter();

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule, adapter);
  const asyncapiDocument = await makeAsyncapiDocument(app);
  await AsyncApiModule.setup(DOC_RELATIVE_PATH, app, asyncapiDocument);

  await app.listen(PORT, HOST);

  const baseUrl = `http://${HOST}:${PORT}`;
  const docUrl = baseUrl + DOC_RELATIVE_PATH;
  Logger.log(`Server started at ${baseUrl}; AsyncApi at ${docUrl};`, BOOTSTRAP);
}

bootstrap();
