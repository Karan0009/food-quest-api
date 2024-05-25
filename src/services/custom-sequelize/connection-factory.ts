import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Config } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { LoggerFactory } from '../logger/logger';

export class ConnectionFactory implements OnModuleDestroy {
  logger = new LoggerFactory().getLogger('db');
  constructor(private readonly config: ConfigService) {}

  connection: Sequelize = undefined;
  async init() {
    try {
      const dbOptions: SequelizeOptions = {
        username: this.config.get('DB_USERNAME'),
        password: this.config.get('DB_PASSWORD'),
        host: this.config.get('DB_HOST'),
        port: +this.config.get('DB_PORT'),
        dialect: this.config.get('DB_DIALECT'),
        database: this.config.get('DB_NAME'),
        dialectOptions:
          this.config.get('DB_SSL_MODE') === 'true'
            ? {
                ssl: { require: true },
              }
            : undefined,
        pool: { max: 2, min: 1 },
        benchmark: true,
        repositoryMode: false,
        models: [join(__dirname, '../../', 'models')],
        define: {
          underscored: true,
          timestamps: true,
        },
        logging: (query: string, timing: number): void => {
          this.config.get('DEBUG') === 'true'
            ? this.logger.debug(`${query}, duration: ${timing}ms`, 'db', {
                query: query,
                duration: timing,
              })
            : this.logger.info(`${query}, duration: ${timing}ms`, 'db');
        },
        hooks: {
          afterConnect: (config: Config) => {
            this.logger.info('db connected', {
              database: config.database,
              port: config.port,
              username: config.username,
            });
          },
          afterInit: () => {
            this.logger.info('Sequelize started!');
          },
          afterDisconnect: () => {
            this.logger.info('db disconnected');
          },
          afterDestroy: () => {
            this.logger.info('db destroyed');
          },
        },
      };
      this.connection = new Sequelize(dbOptions);
      await this.connection.authenticate();
      // TODO: disable this.connection.sync(); when deploying
      // await this.connection.sync({ alter: true, force: true });
      return this.connection;
    } catch (err) {
      throw err;
    }
  }
  async onModuleDestroy() {
    if (this.connection) await this.connection.close();
  }
}
