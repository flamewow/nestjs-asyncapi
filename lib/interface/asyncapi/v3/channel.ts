import { ChannelBindings } from './channel.bindings';
import { Messages } from './messages';
import { ParametersDescription } from './parameters.description';
import { Ref } from './ref';
import { Tag } from './tag';

/**
 * https://www.asyncapi.com/docs/reference/specification/v3.0.0#channelObject
 */
export interface Channel {
  address: string | null;
  messages: Messages;
  title: string;
  summary: string;
  description: string;
  servers: Ref[];
  parameters: ParametersDescription;
  tags: Tag;
  bindings: ChannelBindings;
}
