import * as winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, splat } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${message} ${stack ? `\nStack: ${stack}` : ''}`;
});

const logger = winston.createLogger({
  level: 'error',
  format: combine(timestamp(), splat(), logFormat),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
