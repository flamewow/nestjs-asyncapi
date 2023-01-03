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

    const channels = flatChannels.reduce((acc, { key, value }) => {
      if (!acc[key]) {
        acc[key] = value;
      }

      acc[key].publish = acc[key].publish ?? value.publish;
      acc[key].subscribe = acc[key].subscribe ?? value.subscribe;

      return acc;
    }, {});

    return { channels };
  }
}
