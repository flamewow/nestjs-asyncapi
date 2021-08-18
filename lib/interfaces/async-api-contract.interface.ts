import { AsyncApiServers } from './async-api-servers.interface';
import { AsyncApiComponents } from './async-api-components.interface';
import { AsyncApiChannels } from './async-api-channels.interface';

export interface AsyncApiContract {
  asyncapi: string;
  id?: string;
  /** @default application/json **/
  defaultContentType: string;
  info: {
    title: string;
    version: string;
    description: string;
    license?: { name: string; url: string };
    termsOfService?: string;
    contact?: { name: string; url: string; email: string };
  };
  servers?: AsyncApiServers;
  components: AsyncApiComponents;
  channels: AsyncApiChannels;
}
