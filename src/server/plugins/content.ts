import chokidar from "chokidar";

import { parseFile, resolveFile } from "../file";
import { attachEvents } from "../helpers";
import { Plugin, PluginContext } from "../plugin";

export class ContentPlugin extends Plugin {
  readonly watcher = chokidar.watch(this.contentPath, {
    disableGlobbing: true,
  });

  constructor(context: PluginContext) {
    super(context);

    attachEvents(this.watcher, ["add", "change"], (filePath: string) => {
      const resolvedFile = resolveFile(this.contentPath, filePath);
      const value = parseFile(resolvedFile);

      const typeOf = typeof value;

      if (resolvedFile.parsed.name === "index" && typeOf !== "object") {
        throw new Error(`File ${resolvedFile.relativePath} must resolve an object (got ${typeOf})`);
      }

      if (value) {
        this.state.set(resolvedFile.key, value);
      }
    });

    this.watcher.on("unlink", (filePath) => {
      const resolvedFile = resolveFile(this.contentPath, filePath);

      this.state.delete(resolvedFile.key);
    });
  }

  async unload(): Promise<void> {
    this.watcher.close();
  }
}
