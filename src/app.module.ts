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
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(ContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
