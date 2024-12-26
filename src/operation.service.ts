import { Inject, Injectable } from '@nestjs/common';
import { Task } from './Task';

@Injectable()
export class OperationService {
  id = ''
  operations = []

  constructor(
    @Inject('OPERATION_TASKS') private readonly providedTasks: any
  ) {}

  async schedule(operation: any): Promise<any> {
    const someId = '123'
    this.operations.push({
      id: someId,
      ...operation
    });
    this.id = someId;

    return this
  }

  async start(name: string): Promise<any> {
    const operation = this.operations.find(o => o.id === this.id)

    const { metadata } = operation

    if (!operation) {
      throw new Error('No operation found!');
    }

    const abstractTask = this.providedTasks.find(p => p.name === operation.name);

    if (!abstractTask) {
      throw new Error(`We don't have a task with that name`);
    }

    const instance: Task = new abstractTask(
      name,
      metadata
    )
    instance.validate(operation.metadata)

    return { message: instance.process(operation.metadata) }

    // if (typeof instance.doSomething() === 'function') {
    //   instance.doSomething()

    //   return { message: 'hey!' }
    // }
  }
}