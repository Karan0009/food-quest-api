import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email/email/email.service';
import { UserModule } from './modules/user/user.module';
import { CustomSequelizeModule } from './db/custom-sequelize/custom-sequelize.module';
import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from './services/jwt/jwt.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConstantsModule } from './services/constants/constants.module';
import { UtilsModule } from './services/utils/utils.module';
import { ContextMiddleware } from './core/context/context.middleware';

console.log({
  path: join(__dirname, '../', 'environments', `.env.${process.env.NODE_ENV}`),
});
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
      envFilePath: join(
        __dirname,
        '../',
        'environments',
        `.env.${process.env.NODE_ENV}`,
      ),
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
