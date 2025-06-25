import { Module } from '@nestjs/common';

import { Redis } from 'ioredis';
import { redlockProvider } from './redlock.provider';
import * as config from 'config';

const redisConfig = config.get('redisConfig');
const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    return new Redis(redisConfig);
  },
};

@Module({
  providers: [redisProvider, redlockProvider],
  exports: ['REDIS_CLIENT', 'REDLOCK'],
})
export class RedisModule {}
