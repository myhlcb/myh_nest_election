import {
  Module,
  NestModule,
  MiddlewareConsumer,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotersModule } from './voters/voters.module';
import { AdminModule } from './admin/admin.module';
import { VotesModule } from './votes/votes.module';
import { PublicModule } from './public/public.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RedisModule } from './redis/redis.module';
import { Voter } from './voters/voter.entity';
import * as config from 'config';
interface MysqlConfig {
  type: 'mysql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  synchronize: boolean;
}

const mysqlConfig = config.get('dbConfig.mysql') as MysqlConfig;
@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
    VotersModule,
    AdminModule,
    VotesModule,
    PublicModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  async onApplicationBootstrap() {
    const userRepo = this.dataSource.getRepository(Voter);
    const exist = await userRepo.findOneBy({ ssn: '000-00-0000' });

    if (!exist) {
      await userRepo.save({
        name: 'Admin',
        ssn: '000-00-0000',
        role: 'admin',
        verified: true,
      });
      console.log('✅ 初始管理员创建成功');
    } else {
      console.log('ℹ️ 管理员已存在，跳过创建');
    }
  }
}
