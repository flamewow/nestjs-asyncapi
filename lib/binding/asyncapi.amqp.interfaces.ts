// https://github.com/asyncapi/bindings/tree/master/amqp

export interface AmqpServerBindingObject {}

export interface AmqpChannelBindingObject {
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

export interface AmqpOperationBindingObject {
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

export interface AmqpMessageBindingObject {
  contentEncoding?: string;
  messageType?: string;
  bindingVersion?: string;
}
