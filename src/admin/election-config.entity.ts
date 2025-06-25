import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ElectionStatus } from '../common/enums/election-status.enum';

@Entity('election_config')
export class ElectionConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ElectionStatus,
    default: ElectionStatus.NOT_STARTED,
  })
  status: ElectionStatus;
}
