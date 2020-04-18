import { Plugin, PluginContext } from "./plugin";

export class PluginManager {
  readonly plugins = new Set<Plugin>();

  constructor(readonly context: PluginContext) {}

  register(pluginConstructor: typeof Plugin): void {
    this.plugins.add(
      Reflect.construct(pluginConstructor, [
        {
          ...this.context,
          logger: this.context.logger.child({
            label: pluginConstructor.name,
          }),
        },
      ])
    );
  }

  async load(): Promise<void> {
    const promises = new Array<void | Promise<void>>();

    this.plugins.forEach((plugin) => {
      if (typeof plugin.load !== "function") {
        return;
      }

      promises.push(plugin.load());
    });

    await Promise.all(promises);
  }

  async unload(): Promise<void> {
    const promises = new Array<void | Promise<void>>();

    this.plugins.forEach((plugin) => {
      if (typeof plugin.unload !== "function") {
        return;
      }

      promises.push(plugin.unload());
    });

    await Promise.all(promises);
  }
}
