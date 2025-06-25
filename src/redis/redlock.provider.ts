import Redlock from 'redlock';
import { Redis } from 'ioredis';

export const redlockProvider = {
  provide: 'REDLOCK',
  useFactory: (redisClient: Redis) => {
    return new Redlock([redisClient], {
      retryCount: 3,
      retryDelay: 200, // 毫秒
    });
  },
  inject: ['REDIS_CLIENT'],
};
