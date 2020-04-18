import { EventEmitter } from "events";
import { ParsedPath } from "path";

export function formatKey(parsed: ParsedPath): string {
  if (parsed.name === "index") {
    return parsed.dir;
  }

  return `${parsed.dir}/${parsed.name}`;
}

export function attachEvents(
  target: EventEmitter,
  events: string[],
  listener: (...args: any[]) => void
): () => void {
  events.forEach((event) => target.on(event, listener));

  return (): void => {
    events.forEach((event) => target.off(event, listener));
  };
}
