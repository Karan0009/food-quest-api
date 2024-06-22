import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email/email/email.service';
import { UserModule } from './modules/user/user.module';
import { CustomSequelizeModule } from './services/custom-sequelize/custom-sequelize.module';
import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from './services/jwt/jwt.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConstantsModule } from './services/constants/constants.module';
import { UtilsModule } from './services/utils/utils.module';
import { ContextMiddleware } from './core/context/context.middleware';
import { CachingModule } from './services/caching/caching.module';
import { CryptoService } from './services/crypto/crypto.service';
import { AuthModule } from './modules/auth/auth.module';
// import { SmsService } from './services/sms/sms.service';
import { SmsModule } from './services/sms/sms.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './lib/guards/auth.guard';

const VALID_ENVS = ['dev', 'testing', 'production'];

function getEnvFilepath(nodeEnv?: string): string {
  if (!nodeEnv || !VALID_ENVS.includes(nodeEnv))
    return join(__dirname, '../', 'environments', '.env.dev');
  return process.env.NODE_ENV === 'production'
    ? join(__dirname, '../', '.env')
    : join(__dirname, '../', 'environments', `.env.${nodeEnv}`);
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static/',
      serveStaticOptions: {
        cacheControl: true,
      },
    }),
    AuthModule,
    UserModule,
    JwtModule,
    ConfigModule.forRoot({
      cache: false,
      envFilePath: getEnvFilepath(process.env.NODE_ENV),
      isGlobal: true,
    }),
    ConstantsModule,
    CustomSequelizeModule,
    UtilsModule,
    CachingModule,
    SmsModule,
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   inject: [ConfigService],
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     const logger = new LoggerFactory().getLogger(
    //       'redis-connection-factory',
    //     );
    //     try {
    //       const store = await redisStore({
    //         password: configService.get('REDIS_CACHE_PASSWORD'),
    //         socket: {
    //           host: configService.get('REDIS_CACHE_HOST'),
    //           port: configService.get('REDIS_CACHE_PORT'),
    //         },
    //         ttl: 30 * 24 * 60 * 60 * 1000, // 1 day
    //       });
    //       logger.info('connected to redis server!');
    //       return {
    //         store,
    //       };
    //     } catch (err) {
    //       logger.error('error while connecting to redis server', err);
    //     }
    //   },
    // }),
  ],
  controllers: [AppController],

  providers: [
    AppService,
    EmailService,
    CryptoService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(ContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
