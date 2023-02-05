import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as fs from 'fs/promises';
import jsyaml from 'js-yaml';
import request from 'supertest';
import { AsyncApiModule } from '#lib';
import { AppModule } from '#sample/app.module';
import { makeAsyncapiDocument } from '#sample/common';
import { DOC_RELATIVE_PATH } from '#sample/constants';

describe('Express AsyncAPI', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
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
    const htmlSample = await fs.readFile('./misc/references/ref.html', {
      encoding: 'utf8',
    });
    expect(text).toEqual(htmlSample);
  });

  it('should serve doc json', async () => {
    const { text } = await request(app.getHttpServer())
      .get(`${DOC_RELATIVE_PATH}-json`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const jsonFetched = JSON.parse(text);
    const jsonReferenceSample = JSON.parse(
      await fs.readFile('./misc/references/ref.json', {
        encoding: 'utf8',
      }),
    );

    expect(jsonFetched).toEqual(jsonReferenceSample);
  });

  it('should serve doc yaml', async () => {
    const { text } = await request(app.getHttpServer())
      .get(`${DOC_RELATIVE_PATH}-yaml`)
      .expect(200)
      .expect('Content-Type', /text\/yaml/);

    const yamlFetched = jsyaml.load(text);
    const yamlReferenceSample = jsyaml.load(
      await fs.readFile('./misc/references/ref.yaml', {
        encoding: 'utf8',
      }),
    );

    expect(yamlFetched).toEqual(yamlReferenceSample);
  });
});
