import {
  AsyncOneOfMessageObject,
  AsyncOperationMessageObject,
  AsyncOperationObject,
  DenormalizedDoc,
} from './interfaces';
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
        acc[it.key].publish = this.mergeOperation(
          acc[it.key].publish,
          it.value.publish,
        );
        acc[it.key].subscribe = this.mergeOperation(
          acc[it.key].subscribe,
          it.value.subscribe,
        );
      } else {
        acc[it.key] = it.value;
      }

      return acc;
    }, {});

    return { channels };
  }

  private mergeOperation(
    prevOperation: AsyncOperationObject | undefined,
    currentOperation?: AsyncOperationObject,
  ): AsyncOperationObject {
    const baseOperation = prevOperation || currentOperation;
    if (!baseOperation) return baseOperation;

    const prevMessage = prevOperation?.message,
      const currentMessage = currentOperation?.message;

    const messageList: AsyncOperationMessageObject[] = [];
    [prevMessage, currentMessage].forEach((messageObject) => {
      if (messageObject === undefined) return;

      const oneOfMessage = messageObject as AsyncOneOfMessageObject;
      if (oneOfMessage?.oneOf !== undefined) {
        oneOfMessage.oneOf.forEach((message) => {
          messageList.push(message);
        });
      } else {
        messageList.push(messageObject as AsyncOperationMessageObject);
      }
    });

    if (messageList.length === 1) {
      baseOperation.message = messageList[0];
    } else if (messageList.length > 1) {
      baseOperation.message = {
        oneOf: messageList,
      };
    }

    return baseOperation;
  }
}
