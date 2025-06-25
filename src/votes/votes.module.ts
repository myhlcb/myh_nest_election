import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from './vote.entity';
import { Voter } from '../voters/voter.entity';
import { Candidate } from '../admin/candidate.entity';
import { ElectionConfig } from '../admin/election-config.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, Voter, Candidate, ElectionConfig]),
    RedisModule,
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
