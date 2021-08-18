import { AsyncApiGenerator } from './async-api-generator';
import { contractData } from './data';
import fs from 'fs';

const gen = new AsyncApiGenerator();

const handle = async () => {
  const html = await gen.generate(contractData);
  fs.writeFileSync('asyncapi.html', html);
  console.log('done');
};

handle();
