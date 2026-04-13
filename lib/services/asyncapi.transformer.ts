import {
  AsyncChannelsObject,
  AsyncMessageObject,
  AsyncOperationObject,
  AsyncOperationsObject,
  DenormalizedDoc,
  DenormalizedOperation,
} from '../interface';

export class AsyncapiTransformer {
  public normalizeChannels(denormalizedDocs: DenormalizedDoc[]): {
    channels: AsyncChannelsObject;
    operations: AsyncOperationsObject;
    componentMessages: Record<string, AsyncMessageObject>;
  } {
    const channels: AsyncChannelsObject = {};
    const operations: AsyncOperationsObject = {};
    const componentMessages: Record<string, AsyncMessageObject> = {};

    for (const doc of denormalizedDocs) {
      /**
       * In AsyncAPI v3, channel keys are used as JSON Reference identifiers.
       * Slashes and other special characters break JSON Pointer resolution, so
       * we sanitize the key to a camelCase identifier while preserving the
       * original routing address in the `address` field.
       *
       * Example: "ws/create/feline" → key "wsCreateFeline", address "ws/create/feline"
       */
      const channelAddress = doc.root.name;
      const channelKey = this.toChannelKey(channelAddress);

      // Initialise channel entry on first encounter.
      if (!channels[channelKey]) {
        channels[channelKey] = {
          address: channelAddress,
          description: doc.root.description,
          parameters: doc.root.parameters,
          bindings: doc.root.bindings,
          messages: {},
        };
      }

      for (const action of ['send', 'receive'] as const) {
        const denormOp: DenormalizedOperation | undefined =
          doc.operations?.[action];
        if (!denormOp) continue;

        const operationKey =
          denormOp.operationId ?? this.buildOperationKey(action, channelKey);

        const messageRefs: { $ref: string }[] = [];

        for (const [msgName, msgObject] of Object.entries(denormOp.messages)) {
          // Add to components.messages (deduplicate by name).
          componentMessages[msgName] = msgObject;

          // Add reference in channel.messages.
          channels[channelKey].messages[msgName] = {
            $ref: `#/components/messages/${msgName}`,
          };

          // Collect message ref for the operation.
          messageRefs.push({
            $ref: `#/channels/${channelKey}/messages/${msgName}`,
          });
        }

        const {
          operationId: _id,
          messages: _msgs,
          ...operationRest
        } = denormOp;

        const operation: AsyncOperationObject = {
          ...operationRest,
          action,
          channel: { $ref: `#/channels/${channelKey}` },
          messages: messageRefs,
        };

        operations[operationKey] = operation;
      }
    }

    return { channels, operations, componentMessages };
  }

  /**
   * Converts an arbitrary channel address into a camelCase identifier safe for
   * use as a JSON Reference key.
   *
   * Examples:
   *   "ws/create/feline"  → "wsCreateFeline"
   *   "user.signed-up"    → "userSignedUp"
   *   "ms/journal"        → "msJournal"
   */
  private toChannelKey(address: string): string {
    const parts = address.split(/[^a-zA-Z0-9]+/).filter(Boolean);
    return parts
      .map((part, i) =>
        i === 0
          ? part.charAt(0).toLowerCase() + part.slice(1)
          : part.charAt(0).toUpperCase() + part.slice(1),
      )
      .join('');
  }

  /**
   * Derives an operation key from action and channel address when no explicit
   * operationId is provided.
   *
   * Examples:
   *   send    + "ws/create/feline"  → "sendWsCreateFeline"
   *   receive + "ms/journal"        → "receiveMsJournal"
   */
  private buildOperationKey(
    action: 'send' | 'receive',
    channelAddress: string,
  ): string {
    const channelKey = this.toChannelKey(channelAddress);
    const pascal = channelKey.charAt(0).toUpperCase() + channelKey.slice(1);
    return `${action}${pascal}`;
  }
}
