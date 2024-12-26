import { Injectable } from '@nestjs/common';
import { SubtaskDefinition } from './core/SubtaskDefinition';

type ConditionType = (metadata: any) => Boolean
type PrePostType = (metadata: any) => Object
type inputOutputType = { [key: string]: string | undefined; }

@Injectable()
export class TaskValidation {
  // TODO: FIND A WAY TO MAKE THIS METADATA DYNMIC, SO THAT WHEN I CALL IT SOMEWHERE TYPE ALWAYS SHOWS
  private metadata: any = {};
  private _errors: Array<any> = [];

  // TODO: CHECK WHATEVER ASYNC/AWAIT WE NEED
  * validate<T>(subtask: SubtaskDefinition<any>): Generator<any> {
    yield this.processInput(subtask.input)
    yield this.processTimeout(subtask.timeout)
    yield this.processPre(subtask.pre)
    yield this.processTask(subtask.task)
    yield this.processPost(subtask.post)
    yield this.processOutput(subtask.output)
  }

  get getMetada(): any {
    return this.metadata
  }

  set setMetadata(metadata: any) {
    this.metadata = metadata
  }

  processTimeout(timeout: number): void {
    if (!timeout) {
      return
    }

    if (typeof timeout !== 'number') {
      this._errors.push('You should provide a number value for the timeout!')
      return
    }

    // TODO: ADD MORE STUFF HERE
  }


  /**
   * Processes a given condition function and returns a boolean result.
   *
   * @param condition - A function that takes metadata as an argument and returns a boolean.
   *                    If the condition is not provided, the function returns true.
   * @returns `true` if the condition is not provided or if the condition function returns a truthy value.
   *          `false` otherwise.
   */
  processCondition(condition: ConditionType | undefined): Boolean {
    if (!condition) {
      return true
    }

    if (typeof condition !== 'function') {
      this._errors.push('There needs to be a function provided here!')
      return false
    }

    const result = condition(this.metadata);
    if (typeof result !== 'boolean') {
      this._errors.push('The value that this function returns should be a Boolean!')
      return false
    }

    return result
  }

  /**
   * Will take and array of fields we want to include and return as a result 
   * those fields that are part of the metadata
   * 
   * @param input { id: 'id', name: 'name' }
   * @returns { id: 1, name: 'something' }
   */
  processInput<T>(input: inputOutputType | undefined): Partial<T> {
    if (!input) {
      return this.metadata
    }

    if (typeof input !== 'object') {
      this._errors.push('Please provide and array with values!')
    }

    const inputFields = Object.keys(input).filter(i => this.metadata[i])
    if (Object.keys(input).length !== inputFields.length) {
      this._errors.push('Please provide correct field for input!')
    }

    return Object.keys(input).reduce((result: Partial<T>, key: string) => {
      if (key in this.metadata) {
        delete this.metadata[key as keyof T]
        this.metadata[key as keyof T] = input[key] as any
        // (result as any)[key] = this.metadata[key as keyof T];
      } else {
        this._errors.push('This is a wrong value being provided here!')
      }

      return result
    }, {} as Partial<T>)
  }

  /**
   * It's a function that will run BEFORE the task is processed!
   * 
   * @param pre ex. (metadata) => ({ id: metadata.id })
   * @returns 
   */
  processPre(pre: PrePostType | undefined): void {
    if (!pre) {
      return
    }

    if (typeof pre !== 'function') {
      this._errors.push('There needs to be a function provided here!')
      return
    }

    const result = pre(this.metadata);
    if (typeof result !== 'object') {
      this._errors.push('The value that this function returns should be an Object!')
      return
    }
    this.metadata = { ...this.metadata, result }
  }

  /**
   * This is the main bread and butter of the application, if there is not Task then it should throw
   * there's always a task to be processed
   * 
   * It will call the task we got and process it on the background!
   * 
   * @param task a class of Type: Task or Subtask
   */
  processTask<T>(task): void {
    if (!task) {
      this._errors.push('There cannot be a subtask without a main defined Task on it')
      return
    }

    if (typeof task !== 'object') {
      this._errors.push(`The main task of the application cannot be anything other then an object!`)
    }

    if (typeof task.execute === undefined) {
      this._errors.push(`The 'execute' Function is not handled by the main Subtask class!`)
    }

    if (typeof task.rollback === undefined) {
      this._errors.push(`The 'rollback' Function is not handled by the main Subtask class!`)
    }

    if (typeof task.requiredMetadta === undefined) {
      this._errors.push(`The 'requiredMetadata' Function is not handled by the main Subtask class!`)
    }

    const requriedMetadata = task.requiredMetadata()

    requriedMetadata.reduce((result: Partial<T>, key: string) => {
      if (key in this.metadata) {
        (result as any)[key] = this.metadata[key as keyof T];
      } else {
        this._errors.push(`required metadata is missing: Missing: ${key}`)
      }

      return result
    }, {} as Partial<T>)

    if (this._errors.length) {
      return
    }
    task.setMetadata(this.metadata)
    return task.execute()
  }

  /**
   * It's a function that will run AFTER the task is processed!
   * 
   * @param post ex. (metadata) => ({ id: metadata.id })
   * @returns 
  */
 processPost(post: PrePostType | undefined): void {
   if (!post) {
     return
   }

   if (typeof post !== 'function') {
     this._errors.push('There needs to be a function provided here!')
     return
   }

   const result = post(this.metadata);
   if (typeof result !== 'object') {
     this._errors.push('The value that this function returns should be an Object!')
      return
    }
    this.metadata = { ...this.metadata, result }
  }

  /**
   * It will output the data to the metadata being managed on the memory
   * 
   * @param output { id: 'id', name: 'name' }
   * @returns { id: 1, name: 'something' }
   */
  processOutput<T>(output: inputOutputType | undefined): Partial<T> {
    if (!output) { 
      return this.metadata
    }

    if (typeof output !== 'object') {
      this._errors.push('Please provide and array with values!')
    }

    const outputFields = Object.keys(output).filter(i => this.metadata[i])
    if (Object.keys(output).length !== outputFields.length) {
      this._errors.push('Please provide correct field for input!')
    }

    return Object.keys(output).reduce((result: Partial<T>, key: string) => {
      if (key in this.metadata) {
        delete this.metadata[key as keyof T]
        this.metadata[key as keyof T] = output[key] as any
        // (result as any)[key] = this.metadata[key as keyof T];
      } else {
        this._errors.push('This is a wrong value being provided here!')
      }

      return result
    }, {} as Partial<T>)
  }
}