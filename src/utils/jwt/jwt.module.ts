import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
@Global()
@Module({
  exports: [JwtService],
  providers: [JwtService],
})
export class JwtModule {}
