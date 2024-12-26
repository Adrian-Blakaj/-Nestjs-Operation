export interface SubtaskInterface<T> {
  execute(): Partial<T>,
  rollback(): void,
  requiredParameters(): void,
}