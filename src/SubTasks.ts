export abstract class SubTasks<T> {
  metadata: { [key: string]: any } = {}
  abstract execute(): Promise<any>;
  abstract rollback(): void;
  abstract requiredMetada(): void;

  set setMetadata(metadata: { [key: string]: any }) {
    this.metadata = metadata
  }
}