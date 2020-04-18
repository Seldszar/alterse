import colors from "colors/safe";
import winston from "winston";

export interface LoggerOptions {
  level?: string;
}

export function createLogger(options: LoggerOptions = {}): winston.Logger {
  const replacer = (key: unknown, value: unknown) => {
    if (typeof value === "bigint") {
      return value.toString();
    }

    if (value instanceof Buffer) {
      return value.toString("base64");
    }

    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }

    return value;
  };

  const logger = winston.createLogger({
    handleExceptions: true,
    level: options.level,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: "mediumTime" }),
          winston.format.errors(),
          winston.format.splat(),
          winston.format.colorize(),
          winston.format.printf(({ label, level, message, stack, timestamp, ...rest }) => {
            let result = `[${timestamp}] `;

            if (label) {
              result += `${colors.bold(label)} `;
            }

            result += `${level}: ${message}`;

            if (stack) {
              result += `\n${colors.gray(stack)}`;
            }

            if (Object.keys(rest).length > 0) {
              result += `\n${colors.gray(JSON.stringify(rest, replacer, 4))}`;
            }

            return result;
          })
        ),
      }),
      new winston.transports.File({
        level: "debug",
        filename: `logs/${Date.now()}.log`,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors(),
          winston.format.splat(),
          winston.format.json({ replacer })
        ),
      }),
    ],
  });

  return logger;
}
