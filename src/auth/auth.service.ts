import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Voter } from '../voters/voter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Voter)
    private voterRepo: Repository<Voter>,
    private jwtService: JwtService,
  ) {}

  async validateSSN(ssn: string): Promise<Voter> {
    const user = await this.voterRepo.findOne({ where: { ssn } });
    if (!user) throw new UnauthorizedException('SSN not found');
    return user;
  }

  async login(user: Voter) {
    const payload = { sub: user.id, ssn: user.ssn, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
