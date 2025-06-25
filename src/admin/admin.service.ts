import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redlock from 'redlock';
import { Candidate } from './candidate.entity';
import { ElectionConfig } from './election-config.entity';
import { ElectionStatus } from '../common/enums/election-status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,

    @InjectRepository(ElectionConfig)
    private configRepo: Repository<ElectionConfig>,

    @Inject('REDLOCK')
    private readonly redlock: Redlock,
  ) {}

  async addCandidate(name: string) {
    const existing = await this.candidateRepo.findOne({ where: { name } });
    if (existing) throw new ConflictException('candidater already add');
    const candidate = this.candidateRepo.create({ name });
    return this.candidateRepo.save(candidate);
  }
  async getElectionConfig(): Promise<ElectionConfig> {
    const config = await this.configRepo.findOne({ where: {} });
    if (!config) {
      return this.configRepo.save(
        this.configRepo.create({ status: ElectionStatus.NOT_STARTED }),
      );
    }
    return config;
  }

  async startElection() {
    const LOCK_KEY = 'lock:election:start';
    try {
      await this.redlock.acquire([LOCK_KEY], 5000);
    } catch (error) {
      throw new ConflictException('系统忙，请稍后再试');
    }

    const config = await this.getElectionConfig();
    if (config.status === ElectionStatus.ONGOING) {
      throw new BadRequestException('Election already started');
    }
    config.status = ElectionStatus.ONGOING;
    return this.configRepo.save(config);
  }

  async stopElection() {
    const config = await this.getElectionConfig();
    if (config.status !== ElectionStatus.ONGOING) {
      throw new BadRequestException('Election not ongoing');
    }
    config.status = ElectionStatus.ENDED;
    return this.configRepo.save(config);
  }

  async getResults() {
    const config = await this.getElectionConfig();
    if (config.status !== ElectionStatus.ENDED) {
      throw new BadRequestException('Election has not ended yet');
    }
    return this.candidateRepo.find({ order: { votes: 'DESC' } });
  }
}
