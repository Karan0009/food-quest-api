import { Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Config } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export class ConnectionFactory implements OnModuleDestroy {
  constructor(private readonly config: ConfigService) {}

  connection: Sequelize = undefined;
  async init() {
    try {
      this.connection = new Sequelize(this.config.get('DB_URL'), {
        hooks: {
          afterConnect: (config: Config) => {
            Logger.log(
              {
                database: config.database,
                port: config.port,
                username: config.username,
              },
              'db',
            );
          },
          afterInit: () => {
            Logger.log('Sequelize started!', 'db');
          },
        },
        benchmark: true,
        models: [join(__dirname, '../../', 'models')],
        define: {
          underscored: true,
          timestamps: true,
        },
        repositoryMode: true,
        logging: (query: string, timing: number): void => {
          this.config.get('DEBUG') === 'true' &&
            Logger.debug(`${query}, duration: ${timing}ms`, 'db', {
              query: query,
              duration: timing,
            });
        },
      });
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
