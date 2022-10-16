import {
  AsyncChannelObject,
  AsyncChannelsObject,
  DenormalizedDoc,
} from '../interface';

export class AsyncapiTransformer {
  public normalizeChannels(
    denormalizedDocs: DenormalizedDoc[],
  ): Record<'channels', AsyncChannelsObject> {
    const flatChannels = denormalizedDocs.map((doc: DenormalizedDoc) => {
      const key = doc.root.name;
      const value: AsyncChannelObject = {
        description: doc.root.description,
        bindings: doc.root.bindings,
        parameters: doc.root.parameters,
        subscribe: doc.operations.sub,
        publish: doc.operations.pub,
      };
      return { key, value };
    });

    // TODO: prettify channels
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
