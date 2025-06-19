import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

@Entity('features')
export class FeatureEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;
  @ManyToOne('StatusEntity', { eager: true })
  @JoinColumn({ name: 'status_id' })
  status: any;

  @Column({ name: 'status_id', type: 'varchar', nullable: true })
  statusId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastCheckStatus: Date;

  @OneToMany('TaskEntity', 'feature')
  tasks: any[];

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
