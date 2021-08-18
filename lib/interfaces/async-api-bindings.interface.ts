/**
 * @see https://www.asyncapi.com/docs/specifications/2.0.0#messageBindingsObject
 * @todo Must implement each protocol binding interface
 */
export interface AsyncApiBindings {
  http?: any;
  ws?: any;
  kafka?: any;
  amqp?: any;
  amqp1?: any;
  mqtt?: any;
  mqtt5?: any;
  nats?: any;
  jms?: any;
  sns?: any;
  sqs?: any;
  stomp?: any;
  redis?: any;
}
