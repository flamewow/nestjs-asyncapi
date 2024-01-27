enum PawsEnum {
  left = 'left',
  right = 'right',
}

enum GendersEnum {
  male = 'male',
  female = 'female',
}

export abstract class Feline {
  id: number;

  name: string;

  age: number;

  gender: GendersEnum;

  dominantPaw: PawsEnum;

  tags: string[];

  birthDatetime: Date;

  constructor(initializer: Record<string, unknown>) {
    Object.assign(this, initializer);
  }
}
