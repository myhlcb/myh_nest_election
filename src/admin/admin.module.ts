import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectionConfig } from './election-config.entity';
import { Candidate } from './candidate.entity';
import { RedisModule } from '../redis/redis.module';
@Module({
  imports: [TypeOrmModule.forFeature([ElectionConfig, Candidate]), RedisModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
