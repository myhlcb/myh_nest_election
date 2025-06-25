import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('candidate')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  votes: number;
}
