import js2yaml from 'js-yaml';
import { AsyncApiContract } from '../interfaces/async-api-contract.interface';

export class ContractParser {
  parse(contract: AsyncApiContract) {
    return js2yaml.safeDump(contract);
  }
}
