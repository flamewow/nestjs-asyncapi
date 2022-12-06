/**
 * AMPQ binding
 * @see https://github.com/asyncapi/bindings/tree/master/amqp
 */

/**
 * This object MUST NOT contain any properties. Its name is reserved for future use.
 */
export interface AmqpServerBinding {}

export interface AmqpChannelBinding {
  is: string;
  exchange?: {
    name: string;
    type: string;
    durable?: boolean;
    autoDelete?: boolean;
    vhost?: string;
  };
  queue?: {
    name: string;
    durable?: boolean;
    exclusive?: boolean;
    autoDelete?: boolean;
    vhost?: string;
  };
  bindingVersion?: string;
}

export interface AmqpOperationBinding {
  expiration?: number;
  userId?: string;
  cc?: string[];
  priority?: number;
  deliveryMode?: number;
  mandatory?: boolean;
  bcc?: string[];
  replyTo?: string;
  timestamp?: boolean;
  ack?: boolean;
  bindingVersion?: string;
}

export interface AmqpMessageBinding {
  contentEncoding?: string;
  messageType?: string;
  bindingVersion?: string;
}
