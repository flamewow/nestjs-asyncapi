import { Injectable } from '@nestjs/common';
import { Feline } from './class';
import { CreateFelineDto } from './dto';

@Injectable()
export class FelinesService {
  private readonly felines: Feline[] = [];

  async get(id: number): Promise<Feline> {
    return this.felines[id];
  }

  async delete(id: number): Promise<boolean> {
    const felineToDelete = this.get(id);
    delete this.felines[id];
    return !!felineToDelete;
  }

  async create(createFelineDto: CreateFelineDto): Promise<Feline> {
    const feline = createFelineDto.payload;
    this.felines.push(feline);
    return feline;
  }
}
