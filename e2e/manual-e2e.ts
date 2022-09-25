import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AsyncApiModule } from '../lib';
import { makeAsyncapiDocument } from './common';
import { BOOTSTRAP, DOC_RELATIVE_PATH, HOST, PORT } from './constants';
import { AppModule } from './src/app.module';

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
