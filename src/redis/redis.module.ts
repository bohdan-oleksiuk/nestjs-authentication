import { Module } from '@nestjs/common';
import { RefreshTokenStorage } from './refresh-token.storage';

@Module({
  providers: [RefreshTokenStorage],
  exports: [RefreshTokenStorage],
})
export class RedisModule {}
