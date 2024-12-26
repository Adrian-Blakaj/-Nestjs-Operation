import { CreateSchedulerDto } from './dto/create-scheduler.dto';

export class Operation {
  private id: string
  private name: string
  private metadata: any
  private status: string
  private error: Object
  private operation: any
  
  constructor() {
    this.operation = []
  }

  createScheduler(createSchedulerDto: CreateSchedulerDto) {
    // Check if the operation exits
    if (this.operation.find(o => createSchedulerDto.operationData.id === o.id)) {
      // TODO: Do something
    }

    // We create a new operation
    const newOperation = {
      id: '123',
      name: createSchedulerDto.name,
      metadata: createSchedulerDto.metadata,
      status: 'PENDING',
      error: {}
    }

    this.operation.push(newOperation)


    // return the created operation with the correct id
    return newOperation;
  }

  schedule(): void {
    this.operation.status = 'SCHEDULED'
  }
}