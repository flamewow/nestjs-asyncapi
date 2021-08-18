export interface ServerVariables {
  [key: string]: {
    enum?: string[];
    default: string;
    description?: string;
    examples?: string[];
  };
}
