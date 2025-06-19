import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, JoinTable } from 'typeorm';
import { UserEntity } from '@src/user/entities/user.entity';
import { ProjectCategoryEntity } from './projectCategory.entity';
import { ProjectSubCategoryEntity } from './projectSubCategory.entity';
import { FeatureEntity } from './feature.entity';
import { RequerimentEntity } from './requeriment.entity';
import { StatusEntity } from './status.entity';
import { TaskEntity } from './task.entity';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'project_owners',
    joinColumn: { name: 'project_id', referencedColumnName: '_id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: '_id' }
  })
  owners: UserEntity[];

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => ProjectCategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: ProjectCategoryEntity;

  @Column({ name: 'category_id', type: 'varchar', nullable: true })
  categoryId: string;

  @ManyToOne(() => ProjectSubCategoryEntity)
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: ProjectSubCategoryEntity;

  @Column({ name: 'sub_category_id', type: 'varchar', nullable: true })
  subCategoryId: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;
  @OneToMany(() => FeatureEntity, () => null)
  features: FeatureEntity[];

  @OneToMany(() => RequerimentEntity, () => null)
  requeriments: RequerimentEntity[];

  @Column({ type: 'int', default: 0 })
  approximateTimeProjection: number;

  @ManyToOne(() => StatusEntity, { eager: true })
  @JoinColumn({ name: 'status_id' })
  status: StatusEntity;

  @Column({ name: 'status_id', type: 'varchar', nullable: true })
  statusId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastCheckStatus: Date;

  @OneToMany(() => TaskEntity, () => null)
  tasks: TaskEntity[];

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'int', default: 0 })
  impact: number;

  @Column({ type: 'text' })
  impactDescription: string;

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
