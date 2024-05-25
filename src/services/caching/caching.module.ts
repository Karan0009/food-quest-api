import { Global, Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CachingUtils } from './caching.utils';
import { ConstantsService } from '../constants/constants.service';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { LoggerFactory } from '../logger/logger';
import { CACHE_MANAGER } from 'src/core/constants';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: CACHE_MANAGER,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new LoggerFactory().getLogger(
          'redis-connection-factory',
        );
        try {
          const store = await redisStore({
            password: configService.get('REDIS_CACHE_PASSWORD'),
            socket: {
              host: configService.get('REDIS_CACHE_HOST'),
              port: configService.get('REDIS_CACHE_PORT'),
            },
            ttl: 30 * 24 * 60 * 60 * 1000, // 1 day
          });
          logger.info('connected to redis server!');
          return store;
        } catch (err) {
          logger.error('error while connecting to redis server', err);
          return null;
        }
      },
    },
    CachingService,
    CachingUtils,
    ConstantsService,
  ],
  exports: [CachingService, CachingUtils, CACHE_MANAGER],
})
export class CachingModule {}
