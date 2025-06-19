import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, JoinTable } from 'typeorm';
import { UserEntity } from '@src/user/entities/user.entity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'task_assigned_users',
    joinColumn: { name: 'task_id', referencedColumnName: '_id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: '_id' }
  })
  assignedUsers: UserEntity[];

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne('StatusEntity', { eager: true })
  @JoinColumn({ name: 'status_id' })
  status: any;

  @Column({ name: 'status_id', type: 'varchar', nullable: true })
  statusId: string;

  @OneToMany(() => TaskEntity, task => task.parentTask)
  tasks: TaskEntity[];

  @ManyToOne(() => TaskEntity, task => task.tasks)
  @JoinColumn({ name: 'parent_task_id' })
  parentTask: TaskEntity;

  @Column({ name: 'parent_task_id', type: 'varchar', nullable: true })
  parentTaskId: string;

  @ManyToOne('FeatureEntity', 'tasks')
  @JoinColumn({ name: 'feature_id' })
  feature: any;

  @Column({ name: 'feature_id', type: 'varchar', nullable: true })
  featureId: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'int', default: 0 })
  approximateTimeProjection: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastCheckStatus: Date;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'int', default: 0 })
  impact: number;

  @Column({ type: 'text' })
  impactDescription: string;

  @ManyToMany('ProjectEntity')
  @JoinTable({
    name: 'task_prev_projects',
    joinColumn: { name: 'task_id', referencedColumnName: '_id' },
    inverseJoinColumn: { name: 'project_id', referencedColumnName: '_id' }
  })
  prevProjects: any[];

  @ManyToMany(() => TaskEntity)
  @JoinTable({
    name: 'task_prev_tasks',
    joinColumn: { name: 'task_id', referencedColumnName: '_id' },
    inverseJoinColumn: { name: 'prev_task_id', referencedColumnName: '_id' }
  })
  prevTasks: TaskEntity[];

  @ManyToMany('RequerimentEntity')
  @JoinTable({
    name: 'task_prev_requeriments',
    joinColumn: { name: 'task_id', referencedColumnName: '_id' },
    inverseJoinColumn: { name: 'requeriment_id', referencedColumnName: '_id' }
  })
  prevRequeriments: any[];

  @ManyToMany('FeatureEntity')
  @JoinTable({
    name: 'task_prev_features',
    joinColumn: { name: 'task_id', referencedColumnName: '_id' },
    inverseJoinColumn: { name: 'feature_id', referencedColumnName: '_id' }
  })
  prevFeatures: any[];

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  // Color properties
  @Column({ type: 'varchar', length: 7, default: '#ffffff' })
  bgColor: string;

  @Column({ type: 'varchar', length: 7, default: '#000000' })
  textColor: string;

  @Column({ type: 'varchar', length: 7, default: '#0066cc' })
  linkColor: string;

  @Column({ type: 'varchar', length: 7, default: '#f5f5f5' })
  secondaryBgColor: string;

  @Column({ type: 'varchar', length: 7, default: '#666666' })
  secondaryTextColor: string;

  @Column({ type: 'varchar', length: 7, default: '#004499' })
  secondaryLinkColor: string;

  @Column({ type: 'varchar', length: 7, default: '#ff6600' })
  accentColor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

