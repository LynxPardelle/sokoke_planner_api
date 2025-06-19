import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable } from 'typeorm';
import { UserEntity } from '@src/user/entities/user.entity';


@Entity('statuses')
export class StatusEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'status_owners',
    joinColumn: { name: 'status_id', referencedColumnName: '_id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: '_id' }
  })
  owners: UserEntity[];

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
