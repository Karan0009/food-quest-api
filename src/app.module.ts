import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './utils/email/email/email.service';
// import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { UserModule } from './modules/user/user.module';
import { CustomSequelizeModule } from './db/custom-sequelize/custom-sequelize.module';
import { Module } from '@nestjs/common';
import { JwtModule } from './utils/jwt/jwt.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConstantsModule } from './utils/constants/constants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static/',
      serveStaticOptions: {
        cacheControl: true,
      },
    }),
    CustomSequelizeModule,
    UserModule,
    JwtModule,
    ConstantsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
