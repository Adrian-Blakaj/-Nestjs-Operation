import { DynamicModule, Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { Task } from './Task';

@Module({})
export class OperationModule {
  static forRoot(options: any = {}): DynamicModule {
    return {
      module: OperationModule,
      providers: [
        {
          provide: 'OPERATION_TASKS',
          useValue: options
        },
        OperationService,
        Task
      ],
      exports: [
        OperationService,
        Task
      ]
    }
  }
}