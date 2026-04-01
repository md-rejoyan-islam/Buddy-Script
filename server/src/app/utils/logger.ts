import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import morgan from "morgan";

const { printf, combine, colorize, timestamp } = format;

const logDirectory = "src/logs";

const customFormat = printf(({ message, timestamp, level, stack }) => {
  const date = new Date(timestamp as string);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hour}:${minutes}:${seconds}  [${level}] : ${message}${stack ? `\n ${stack}` : ""}`;
});

const jsonFormat = combine(timestamp(), format.json());

export const logger = createLogger({
  level: "http",
  format: combine(timestamp(), format.errors({ stack: true })),
  transports: [
    new transports.Console({
      format: combine(colorize({ all: true }), timestamp(), customFormat),
    }),
    new DailyRotateFile({
      level: "info",
      filename: `${logDirectory}/combined-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: jsonFormat,
    }),
    new DailyRotateFile({
      level: "error",
      filename: `${logDirectory}/error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      format: jsonFormat,
    }),
  ],
});

export const morganMiddleware = morgan("short", {
  stream: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
});
