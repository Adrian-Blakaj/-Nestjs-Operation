import { SubtaskDefinition } from './core/SubtaskDefinition'
import { TaskValidation } from './Task-validation';

export class Task {
  subtasks: SubtaskDefinition<any>[];
  name: string
  metadata: any

  constructor(name, metadata, public taskValidation: TaskValidation) {
    this.name = name
    this.subtasks = []
    this.metadata = metadata
  }

  validate(metadata: any) {
    this.taskValidation.setMetadata(metadata)
    for (const subtask of this.subtasks) {
      if (this.taskValidation.processCondition(subtask.condition)) {
        const generator = this.taskValidation.validate(subtask)
        for (const gen of generator) {
          if (!gen) {
            throw new Error('Something went Wrong!')
          }
        }
      }
      this.metadata = this.taskValidation.getMetada()
    }
  }

  process(metadata: any) {
    let result = ''

    for (const s of this.subtasks) {
      const subtask = new s.task()
      subtask.validate(metadata)
      result += subtask.execute()
    }

    return result
    // this.subtasks.forEach(s => {
    //   const subtask = new s.subtask()
    //   subtask.execute()
    // })
  }
}