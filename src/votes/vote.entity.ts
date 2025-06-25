import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { Voter } from '../voters/voter.entity';
import { Candidate } from '../admin/candidate.entity';

@Entity('votes')
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Voter, { eager: true })
  voter: Voter;

  @ManyToOne(() => Candidate, { eager: true })
  candidate: Candidate;
}
