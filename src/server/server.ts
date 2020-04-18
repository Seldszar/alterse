/* eslint-disable @typescript-eslint/ban-types */

import express from "express";
import http from "http";
import socketIO, { Socket } from "socket.io";

export interface ServerOptions {
  mounts?: Record<string, string>;
}

export interface Server {
  router: express.Router;
  close(): Promise<void>;
  emit(event: string, ...args: unknown[]): void;
  listen(port?: number, address?: string): Promise<string>;
  on(event: string, listener: (...args: unknown[]) => void): void;
  on(event: "connection", listener: (socket: Socket) => void): void;
}

export function createServer(options: ServerOptions): Server {
  const app = express();
  const router = express.Router();
  const server = http.createServer(app);

  const io = new socketIO.Server(server, {
    serveClient: false,
  });

  app.use(router);

  for (const [prefix, path] of Object.entries(options.mounts ?? {})) {
    app.use(prefix, express.static(path));
  }

  return {
    router,
    on(event: string, listener: (...args: any[]) => void): void {
      io.on(event, listener);
    },
    emit(event: string, ...args: unknown[]): void {
      io.emit(event, ...args);
    },
    listen(port = 0, address?: string): Promise<string> {
      return new Promise((resolve) => {
        server.listen(port, address, () => {
          const info = server.address();

          resolve(typeof info === "string" ? info : `http://localhost:${info?.port}`);
        });
      });
    },
    async close(): Promise<void> {
      return new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
    },
  };
}
