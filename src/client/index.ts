import Emittery from "emittery";
import { set } from "lodash";
import io from "socket.io-client";

import { SocketEvent } from "../common/constants";

interface StateEventMap<T> {
  change: {
    value: T;
  };
}

export class State<T> extends Emittery<StateEventMap<T>> {
  private nodes = new Map();

  get value(): T {
    const result = Array.from(this.nodes)
      .map((pair) => [pair[0].split("/"), pair[1]])
      .sort((left, right) => left[0].length - right[0].length)
      .reduce((result, pair) => set(result, pair[0], pair[1]), {});

    return result as T;
  }

  replace(value: Iterable<[string, any]>): void {
    this.nodes = new Map(value);

    this.emit("change", {
      value: this.value,
    });
  }

  update(path: string, value: any): void {
    this.nodes.set(path, value);

    this.emit("change", {
      value: this.value,
    });
  }
}

export class Client<T> {
  readonly socket = io();
  readonly state = new State<T>();

  constructor() {
    this.socket.on(SocketEvent.STATE_REPLACED, this.onStateReplaced.bind(this));
    this.socket.on(SocketEvent.STATE_UPDATED, this.onStateUpdated.bind(this));
  }

  private onStateReplaced(value: Array<[string, any]>): void {
    this.state.replace(value);
  }

  private onStateUpdated(data: any): void {
    this.state.update(data.key, data.value);
  }
}
