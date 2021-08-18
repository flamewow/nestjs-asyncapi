import { AsyncApiBindings } from './async-api-bindings.interface';
import { AsyncApiOperation } from './async-api-operation.interface';
import { AsyncApiChannelParamsType } from '../types/async-api-channel-params.type';

export interface AsyncApiChannel {
  /**
   * Reference to a schema name, with nestjs-asyncapi you just need to refer the schema name
   * but you have to ensure that the schema is registered
   * @example "#/components/schemas/user" => "user"
   * @todo Check if we can use type linking and the type with decorator AsyncSchema so we can link automatically
   * but probably we would need to validate whether the type has or not metadata
   */
  $ref?: string;
  description?: string;
  subscribe?: AsyncApiOperation;
  publish?: AsyncApiOperation;
  parameters?: AsyncApiChannelParamsType;
  bindings?: AsyncApiBindings;
}
