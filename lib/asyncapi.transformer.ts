import { DenormalizedDoc } from './interfaces';
import { AsyncChannelObject, AsyncChannelsObject } from './index';

export class AsyncapiTransformer {
  public normalizeChannels(
    denormalizedDocs: DenormalizedDoc[],
  ): Record<'channels', AsyncChannelsObject> {
    const flatChannels = denormalizedDocs.map((d: DenormalizedDoc) => {
      const key = d.root.name;
      const value = {
        description: d.root.description,
        bindings: d.root.bindings,
        parameters: d.root.parameters,
        subscribe: d.operations.sub,
        publish: d.operations.pub,
      } as AsyncChannelObject;
      return { key, value };
    });
    const channels = flatChannels.reduce((acc, it) => {
      if (acc[it.key]) {
        acc[it.key].publish = acc[it.key].publish || it.value.publish;
        acc[it.key].subscribe = acc[it.key].subscribe || it.value.subscribe;
      } else {
        acc[it.key] = it.value;
      }

      return acc;
    }, {});

    return { channels };
  }
}
