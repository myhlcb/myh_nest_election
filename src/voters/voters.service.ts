import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voter } from './voter.entity';

@Injectable()
export class VotersService {
  constructor(
    @InjectRepository(Voter)
    private readonly voterRepo: Repository<Voter>,
  ) {}

  async register(name: string, ssn: string) {
    const existing = await this.voterRepo.findOne({ where: { ssn } });
    if (existing) throw new ConflictException('SSN already registered');

    const voter = this.voterRepo.create({ name, ssn });
    return this.voterRepo.save(voter);
  }

  async verify(ssn: string) {
    const voter = await this.voterRepo.findOne({ where: { ssn } });
    if (!voter) throw new NotFoundException('Voter not found');

    voter.verified = true;
    return this.voterRepo.save(voter);
  }

  async findBySSN(ssn: string) {
    return this.voterRepo.findOne({ where: { ssn } });
  }
}
