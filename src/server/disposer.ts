export class Disposer<T> {
  constructor(readonly dispose: () => T) {}
}
