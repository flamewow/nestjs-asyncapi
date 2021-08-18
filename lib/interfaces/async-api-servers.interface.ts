import { ApiServerOptions } from './api-server-options.interface';

export interface AsyncApiServers {
  [name: string]: ApiServerOptions;
}
