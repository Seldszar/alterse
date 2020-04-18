import { Logger } from "winston";

import { Profile } from "./profile";
import { Server } from "./server";
import { State } from "./state";

export interface PluginContext {
  logger: Logger;
  contentPath: string;
  publicPath: string;
  profile: Profile;
  server: Server;
  state: State;
}

export interface Plugin {
  load?(): Promise<void> | void;
  unload?(): Promise<void> | void;
}

export abstract class Plugin {
  get logger(): Logger {
    return this.context.logger;
  }

  get contentPath(): string {
    return this.context.contentPath;
  }

  get publicPath(): string {
    return this.context.publicPath;
  }

  get profile(): Profile {
    return this.context.profile;
  }

  get server(): Server {
    return this.context.server;
  }

  get state(): State {
    return this.context.state;
  }

  constructor(readonly context: PluginContext) {}
}
