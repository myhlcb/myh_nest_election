import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { Voter } from '../voters/voter.entity';
import { Candidate } from '../admin/candidate.entity';
import { ElectionConfig } from '../admin/election-config.entity';
import { ElectionStatus } from '../common/enums/election-status.enum';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,
    @InjectRepository(Voter)
    private voterRepo: Repository<Voter>,
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,
    @InjectRepository(ElectionConfig)
    private configRepo: Repository<ElectionConfig>,
  ) {}

  // 投票
  async vote(voterId: number, candidateId: number) {
    const config = await this.configRepo.findOne({ where: {} });
    if (!config || config.status !== ElectionStatus.ONGOING) {
      throw new BadRequestException('Voting is not allowed at this stage');
    }

    const voter = await this.voterRepo.findOne({ where: { id: voterId } });
    if (!voter || !voter.verified) {
      throw new BadRequestException('Voter not verified or not found');
    }
    if (voter.hasVoted) {
      throw new BadRequestException('You have already voted');
    }

    const candidate = await this.candidateRepo.findOne({
      where: { id: candidateId },
    });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    // 事务处理：投票 + 更新候选人票数 + 标记投票状态
    await this.voteRepo.manager.transaction(async (manager) => {
      await manager.save(Vote, { voter, candidate });
      await manager.update(Candidate, candidate.id, {
        votes: candidate.votes + 1,
      });
      await manager.update(Voter, voter.id, { hasVoted: true });
    });

    return { message: 'Vote submitted successfully' };
  }
}
