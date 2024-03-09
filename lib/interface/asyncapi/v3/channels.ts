import { Channel } from './channel';
import { Ref } from './ref';

/**
 * https://www.asyncapi.com/docs/reference/specification/v3.0.0#channelsObject
 */
export interface Channels {
  [channelId: string]: Channel | Ref;
}
