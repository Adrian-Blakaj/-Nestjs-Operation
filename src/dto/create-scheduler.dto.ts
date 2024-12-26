import { CreateSchedulerEnum } from 'src/enums';

export class CreateSchedulerDto {
  name: string
  type: CreateSchedulerEnum
  metadata: Object
  operationData: any
}