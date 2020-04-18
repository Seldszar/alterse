import Emittery from "emittery";

interface EventDataMap {
  change: {
    type: "delete" | "set";
    key: string;
    value?: any;
  };
}

export class State extends Emittery<EventDataMap> {
  nodes = new Map<string, any>();

  get(key: string): any {
    return this.nodes.get(key);
  }

  has(key: string): boolean {
    return this.nodes.has(key);
  }

  set(key: string, value: any): void {
    this.nodes.set(key, value);

    console.log(key, value);

    this.emit("change", {
      type: "set",
      value,
      key,
    });
  }

  delete(key: string): void {
    this.nodes.delete(key);

    this.emit("change", {
      type: "delete",
      key,
    });
  }

  update(key: string, updater: (value: any) => any): void {
    this.set(key, updater(this.get(key)));
  }

  toArray(): Array<[string, any]> {
    return Array.from(this.nodes);
  }
}
