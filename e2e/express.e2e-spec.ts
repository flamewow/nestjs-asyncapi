import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import request from 'supertest';
import { AsyncApiModule } from '../lib';
import { makeAsyncapiDocument } from './common';
import { DOC_RELATIVE_PATH } from './constants';
import { AppModule } from './src/app.module';

describe('Express AsyncAPI', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      { logger: false },
    );
    const asyncapiDocument = await makeAsyncapiDocument(app);
    await AsyncApiModule.setup(DOC_RELATIVE_PATH, app, asyncapiDocument);

    await app.init();
  });

  it('should serve doc html', async () => {
    const { text } = await request(app.getHttpServer())
      .get(DOC_RELATIVE_PATH)
      .expect(200)
      .expect('Content-Type', /text\/html/);
    const htmlSample = await fs.readFile('./e2e/samples/sample.html', {
      encoding: 'utf8',
    });
    expect(text).toEqual(htmlSample);
  });

  it('should serve doc json', async () => {
    const { text } = await request(app.getHttpServer())
      .get(`${DOC_RELATIVE_PATH}-json`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const jsonSample = await fs.readFile('./e2e/samples/sample.json', {
      encoding: 'utf8',
    });
    expect(text).toEqual(jsonSample);
  });

  it('should serve doc yaml', async () => {
    const { text } = await request(app.getHttpServer())
      .get(`${DOC_RELATIVE_PATH}-yaml`)
      .expect(200)
      .expect('Content-Type', /text\/yaml/);
    const yamlSample = await fs.readFile('./e2e/samples/sample.yaml', {
      encoding: 'utf8',
    });
    expect(text).toEqual(yamlSample);
  });
});
