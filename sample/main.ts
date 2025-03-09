import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExpressAdapter } from '@nestjs/platform-express';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { makeAsyncapiDocument } from './common';
import { BOOTSTRAP, DOC_RELATIVE_PATH, HOST, PORT } from './constants';
import { AsyncApiModule } from '#lib';

const USE_FASTIFY = false;

const adapter = USE_FASTIFY
  ? new FastifyAdapter({
      ignoreTrailingSlash: false,
    })
  : new ExpressAdapter();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<INestApplication>(
    AppModule,
    adapter,
    {},
  );
  const asyncapiDocument = await makeAsyncapiDocument(app);
  await AsyncApiModule.setup(DOC_RELATIVE_PATH, app, asyncapiDocument);

  app.connectMicroservice<MicroserviceOptions>({ transport: Transport.TCP });

  await app.startAllMicroservices();
  await app.listen(PORT, HOST);

  const baseUrl = `http://${HOST}:${PORT}`;
  const docUrl = baseUrl + DOC_RELATIVE_PATH;
  Logger.log(`Server started at ${baseUrl}; AsyncApi at ${docUrl};`, BOOTSTRAP);
}

bootstrap();
