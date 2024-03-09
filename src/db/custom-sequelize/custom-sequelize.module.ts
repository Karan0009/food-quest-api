import { Global, Module } from '@nestjs/common';
import { CONNECTION } from 'src/core/constants';
import { ConnectionFactory } from './connection-factory';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: CONNECTION,
      useFactory: async (config: ConfigService) => {
        return await new ConnectionFactory(config).init();
      },
      inject: [ConfigService],
    },
  ],
  exports: [CONNECTION],
})
export class CustomSequelizeModule {}
