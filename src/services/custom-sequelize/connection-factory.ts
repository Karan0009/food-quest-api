import { Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Config } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

export class ConnectionFactory implements OnModuleDestroy {
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
        repositoryMode: true,
        models: [join(__dirname, '../../', 'models')],
        define: {
          underscored: true,
          timestamps: true,
        },
        logging: (query: string, timing: number): void => {
          this.config.get('DEBUG') === 'true'
            ? Logger.debug(`${query}, duration: ${timing}ms`, 'db', {
                query: query,
                duration: timing,
              })
            : Logger.log(`${query}, duration: ${timing}ms`, 'db');
        },
        hooks: {
          afterConnect: (config: Config) => {
            Logger.log(
              {
                database: config.database,
                port: config.port,
                username: config.username,
                message: 'db connected',
              },
              'db',
            );
          },
          afterInit: () => {
            Logger.log('Sequelize started!', 'db');
          },
          afterDisconnect: () => {
            Logger.log(
              {
                message: 'db disconnected',
              },
              'db',
            );
          },
          afterDestroy: () => {
            Logger.log(
              {
                message: 'db destroyed',
              },
              'db',
            );
          },
        },
      };
      this.connection = new Sequelize(dbOptions);
      await this.connection.authenticate();
      await this.connection.sync({ force: true, alter: true });
      return this.connection;
    } catch (err) {
      throw err;
    }
  }
  async onModuleDestroy() {
    if (this.connection) await this.connection.close();
  }
}
