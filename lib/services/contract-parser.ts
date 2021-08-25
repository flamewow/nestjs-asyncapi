import js2yaml from 'js-yaml';
import { AsyncAPIObject } from '..';

export class ContractParser {
  parse(contract: AsyncAPIObject) {
    return js2yaml.safeDump(JSON.parse(JSON.stringify(contract)));
  }
}
