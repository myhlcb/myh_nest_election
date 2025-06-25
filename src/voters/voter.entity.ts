import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('voters')
export class Voter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  ssn: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false, name: 'has_voted' })
  hasVoted: boolean;

  @Column({ default: 'voter' })
  role: 'voter' | 'admin'; // 加入角色字段
}
