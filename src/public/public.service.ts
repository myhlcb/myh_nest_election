import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '../admin/candidate.entity';
import { Repository } from 'typeorm';
import { ElectionConfig } from '../admin/election-config.entity';
import { ElectionStatus } from '../common/enums/election-status.enum';
import Redis from 'ioredis';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,
    @InjectRepository(ElectionConfig)
    private configRepo: Repository<ElectionConfig>,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async getLiveResults() {
    const config = await this.configRepo.findOne({ where: {} });

    if (!config || config.status !== ElectionStatus.ONGOING) {
      throw new ForbiddenException('Live results only available during voting');
    }
    const cacheKey = 'live_results';
    const cached = await this.redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const results = await this.candidateRepo.find({
      select: ['id', 'name', 'votes'],
      order: { votes: 'DESC' },
    });
    await this.redisClient.set(cacheKey, JSON.stringify(results), 'EX', 10);
    return results;
  }
}
