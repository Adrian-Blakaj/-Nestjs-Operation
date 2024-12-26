import { Runtype } from 'src/types/Runtype';
import { Class } from 'utility-types';

export class SubtaskDefinition<T> {
  /**
   * The Task or Subtask that is going to be runned
   */
  task: Class<T>;

  /**
   * An optional name for the subtask
   */
  name?: string;

  timeout?: number;

  runType?: Runtype;

  metadata?: { [key: string]: any };

  // input?: Array<string> | undefined;

  // output?: Array<string> | undefined;

  input?: { [key: string]: string | undefined; };

  output?: { [key: string]: string | undefined; };

  subtasks?: SubtaskDefinition<any>[];

  condition?: (metadata: any) => boolean;

  pre?: (metadata: any) => any | void;

  post?: (metadata: any) => any | void;
}