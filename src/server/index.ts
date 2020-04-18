/* eslint-disable @typescript-eslint/ban-types */

import { get } from "lodash";
import { resolve } from "path";

import { SocketEvent, SocketRequest } from "../common/constants";

import { createLogger } from "./logger";
import { PluginManager } from "./plugin-manager";
import { loadProfile } from "./profile";
import { createServer } from "./server";
import { State } from "./state";

import { ContentPlugin } from "./plugins/content";
import { DiscordPlugin } from "./plugins/discord";

export interface MainOptions {
  address: string;
  cwd: string;
  level: string;
  port: number;
  profile: string;
}

export async function main(options: MainOptions): Promise<() => void> {
  const logger = createLogger({
    level: options.level,
  });

  logger.info("Launching application...");

  const profilePath = resolve(options.cwd, "profiles", options.profile);
  const profile = loadProfile(profilePath);

  const publicPath = resolve(profilePath, get(profile, "paths.public", "public"));
  const contentPath = resolve(profilePath, get(profile, "paths.content", "content"));

  const server = createServer({
    mounts: {
      "/alterse": resolve(__dirname, "../client-compiled"),
      "/content": contentPath,
      "/": publicPath,
    },
  });

  const state = new State();
  const pluginManager = new PluginManager({
    logger,
    contentPath,
    publicPath,
    profile,
    server,
    state,
  });

  server.on("connection", (socket) => {
    socket.on(SocketRequest.FETCH_STATE, () => {
      socket.emit(SocketEvent.STATE_REPLACED, state.toArray());
    });

    socket.emit(SocketEvent.STATE_REPLACED, state.toArray());
  });

  state.on("change", (data) => {
    server.emit(SocketEvent.STATE_UPDATED, data);
  });

  pluginManager.register(ContentPlugin);

  if (profile.discord) {
    pluginManager.register(DiscordPlugin);
  }

  await pluginManager.load();

  logger.info("Server is ready: %s", await server.listen(options.port, options.address));

  return async (): Promise<void> => {
    logger.info("Closing application...");

    await pluginManager.unload();
    await server.close();
  };
}
