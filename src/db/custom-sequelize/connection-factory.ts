import { Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';

export class ConnectionFactory implements OnModuleDestroy {
  constructor(private readonly config: ConfigService) {}

  connection: Sequelize = undefined;
  async init() {
    try {
      //   const connection = new Sequelize({
      //     dialect: this.config.get('DB_DIALECT'),
      //     host: this.config.get('DB_HOST'),
      //     port: +this.config.get('DB_PORT'),
      //     username: this.config.get('DB_USERNAME'),
      //     password: this.config.get('DB_PASSWORD'),
      //     database: this.config.get('DB_NAME'),
      //     models: [join('../', 'models')],
      //     ssl: true,
      //     logging: (query: string, timing: number): void =>
      //       this.config.get('DEBUG') === 'true' &&
      //       Logger.debug(`${query}`, 'db', {
      //         query: query,
      //         duration: timing,
      //       }),
      //     hooks: {
      //       afterConnect(connection, config) {
      //         Logger.log('Database connected!');
      //       },
      //     },
      //   });
      this.connection = new Sequelize(this.config.get('DB_URL'), {
        hooks: {
          afterConnect: () => {
            Logger.log('Database connected!', 'db');
          },
          afterInit: () => {
            Logger.log('Sequelize started!', 'db');
          },
        },
        benchmark: true,
        models: [join('..', 'models')],
        logging: (query: string, timing: number): void => {
          this.config.get('DEBUG') === 'true' &&
            Logger.debug(`${query}, duration: ${timing}ms`, 'db', {
              query: query,
              duration: timing,
            });
        },
      });
      await this.connection.authenticate();
      // await this.connection.sync({ force: true, alter: true });
      return this.connection;
    } catch (err) {
      throw err;
    }
  }
  async onModuleDestroy() {
    if (this.connection) await this.connection.close();
  }
}
