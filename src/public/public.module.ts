import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { Candidate } from '../admin/candidate.entity';
import { ElectionConfig } from '../admin/election-config.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, ElectionConfig]), RedisModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
