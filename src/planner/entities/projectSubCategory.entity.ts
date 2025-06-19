import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

@Entity('project_subcategories')
export class ProjectSubCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;
  @ManyToOne('ProjectCategoryEntity', 'subCategories')
  @JoinColumn({ name: 'category_id' })
  category: any;

  @Column({ name: 'category_id', type: 'varchar', nullable: true })
  categoryId: string;

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
