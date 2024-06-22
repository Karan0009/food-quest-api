import { transports, format, createLogger } from 'winston';
import { getNamespace } from 'cls-hooked';
import { WinstonModule } from 'nest-winston';

const { combine, ms, timestamp, json, errors, colorize, prettyPrint } = format;

const addRequestSessionData = format((info) => {
  const reqContext = getNamespace(`${process.env.APP_NAME}-req-context`);
  const session = reqContext?.get('req-context');
  if (session) {
    return { ...info, ...session };
  }
  return info;
});

function getLoggerFormats() {
  // const DEBUG = process.env.DEBUG || 'false';
  // const USE_JSON_LOGGER = process.env.USE_JSON_LOGGER || 'false';
  // const nodeEnv = process.env.NODE_ENV || 'production';
  // if (USE_JSON_LOGGER === 'true') {
  const consoleFormat = combine(
    ms(),
    addRequestSessionData(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:sss:Z' }),
    json(),
    prettyPrint(),
    errors({ stack: true }),
    // nodeEnv === 'dev' ? prettyPrint() : simple(),
    colorize({
      all: true,
      colors: {
        info: 'green',
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
      },
    }),
  );

  const fileFormat = combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:sss:Z' }),
    addRequestSessionData(),
    timestamp(),
    json(),
  );

  // } else {
  //   fileFormat = combine(
  //     errors({ stack: true }),
  //     timestamp(),
  //     nestWinstonModuleUtilities.format.nestLike(serviceName, {
  //       colors: true,
  //       prettyPrint: nodeEnv === 'dev',
  //     }),
  //   );
  //   consoleFormat = combine(
  //     timestamp(),
  //     ms(),
  //     errors(),
  //     nestWinstonModuleUtilities.format.nestLike(serviceName, {
  //       colors: true,
  //       prettyPrint: true,
  //     }),
  //   );
  // }

  return { consoleFormat, fileFormat };
}

function getDefaultLogger() {
  const DEBUG = process.env.DEBUG || 'false';
  const { consoleFormat, fileFormat } = getLoggerFormats();
  return createLogger({
    level: DEBUG === 'true' ? 'debug' : 'info',
    transports: [
      new transports.Console({ format: consoleFormat }),
      new transports.File({
        filename: 'log/error.log',
        level: 'error',
        format: fileFormat,
      }),
      new transports.File({
        filename: 'log/combined.log',
        format: fileFormat,
      }),
    ],
  });
}

function getNestTypeLogger() {
  const DEBUG = process.env.DEBUG || 'false';
  const { consoleFormat, fileFormat } = getLoggerFormats();
  return WinstonModule.createLogger({
    level: DEBUG === 'true' ? 'debug' : 'info',

    transports: [
      new transports.Console({ format: consoleFormat }),
      new transports.File({
        filename: 'log/error.log',
        level: 'error',
        format: fileFormat,
      }),
    ],
  });
}

class LoggerFactory {
  logger = getNestTypeLogger();

  getLogger(label?: string) {
    const logger = getDefaultLogger();
    return label ? logger.child({ label }) : logger.child({});
  }
}

export { LoggerFactory };
