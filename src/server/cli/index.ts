import commander from "commander";
import exitHook from "exit-hook";

import { main } from "../index";
import { selectProfile } from "../profile";

async function start(): Promise<void> {
  const program = new commander.Command();

  program.option("--port <port>", "port to listen", Number, 3000);
  program.option("--address <address>", "address to listen", String, "0.0.0.0");
  program.option("--cwd <path>", "current working path", String, process.cwd());
  program.option("--level <name>", "logging level", String, "info");
  program.option("--profile <name>", "profile name", String);

  program.parse(process.argv);

  const optionValues = program.opts();

  const { address, cwd, level, port } = optionValues;
  let { profile } = optionValues;

  if (!profile) {
    profile = await selectProfile(cwd);
  }

  const close = await main({
    address,
    cwd,
    level,
    port,
    profile,
  });

  exitHook(close);
}

if (require.main === module) {
  start();
}
