import { transports, format } from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

const { combine, ms, timestamp, json, errors, colorize, prettyPrint } = format;

// function requestIdFormatter(info: any, opts: { req?: Request }) {
//   if (opts.req && opts.req.requestId) {
//     info.requestId = opts.req.requestId;
//   }
//   return info;
// }

function getDefaultLogger(serviceName) {
  let consoleFormat;
  let fileFormat;
  const DEBUG = process.env.DEBUG || 'false';
  const USE_JSON_LOGGER = process.env.USE_JSON_LOGGER || 'false';
  const nodeEnv = process.env.NODE_ENV || 'production';
  if (USE_JSON_LOGGER === 'true') {
    consoleFormat = combine(
      ms(),
      timestamp(),
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

    fileFormat = combine(errors({ stack: true }), timestamp(), json());
  } else {
    fileFormat = combine(
      errors({ stack: true }),
      timestamp(),
      nestWinstonModuleUtilities.format.nestLike(serviceName, {
        colors: true,
        prettyPrint: nodeEnv === 'dev',
      }),
    );
    consoleFormat = combine(
      timestamp(),
      ms(),
      errors(),
      nestWinstonModuleUtilities.format.nestLike(serviceName, {
        colors: true,
        prettyPrint: true,
      }),
    );
  }

  return WinstonModule.createLogger({
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

class LoggerFactory {
  logger = getDefaultLogger('food-quest');
  serviceName = '';

  getLogger(context?: string) {
    // const reqContext = getNamespace(`${defaultConfig.APP_NAME}-req-context`);

    // const curReq: Request = reqContext?.get('req-context');
    return this.logger;
  }
}

export { LoggerFactory };
