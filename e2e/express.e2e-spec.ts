import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import { AsyncApiModule } from '../lib';
import { makeAsyncapiDocument } from './common';

describe('Express AsyncAPI', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = await NestFactory.create<NestExpressApplication>(AppModule);
  });

  it('should server doc', async () => {
    const asyncapiDocument = await makeAsyncapiDocument(app);
    await AsyncApiModule.setup('/asyncapi', app, asyncapiDocument);

    const instance = await app.getHttpAdapter().getInstance().ready();

    instance.ready(async () => {
      const response = await instance.inject({
        method: 'GET',
        url: '/asyncapi',
      });

      expect(response.statusCode).toEqual(200);
    });
  });

  // it('should setup multiple routes', async () => {
  //   const document1 = SwaggerModule.createDocument(app, builder.composeHtml());
  //   SwaggerModule.setup('/swagger1', app, document1);
  //
  //   const document2 = SwaggerModule.createDocument(app, builder.composeHtml());
  //   SwaggerModule.setup('/swagger2', app, document2);
  //
  //   await app.init();
  //   // otherwise throws "FastifyError [FST_ERR_DEC_ALREADY_PRESENT]: FST_ERR_DEC_ALREADY_PRESENT: The decorator 'swagger' has already been added!"
  //   await expect(
  //     app.getHttpAdapter().getInstance().ready()
  //   ).resolves.toBeDefined();
  // });
});
