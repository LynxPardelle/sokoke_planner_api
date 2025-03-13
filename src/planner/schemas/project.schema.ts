import { HydratedDocument, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
/* Types */
import { TUser } from '@src/user/types/user.type';
import { TFeature } from '../types/feature.type';
import { TProject } from '../types/project.type';
import { TProjectCategory } from '../types/projectCategory.type';
import { TProjectSubCategory } from '../types/projectSubCategory.type';
import { TRequeriment } from '../types/requeriment.type';
import { TStatus } from '../types/status.type';
import { TTask } from '../types/task.type';
@Schema()
export class Project implements Omit<TProject, '_id'> {
  @Prop({
    required: true,
    default: [],
    schema: true,
    schemaName: 'User',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'User',
  })
  public owners: (TUser | string)[];
  @Prop({ required: true })
  public name: string;
  @Prop({ required: true })
  public description: string;
  @Prop({
    required: true,
    schema: true,
    schemaName: 'ProjectCategory',
    type: mongoose.Schema.Types.ObjectId || String,
    ref: 'ProjectCategory',
  })
  public category: TProjectCategory | string;
  @Prop({
    required: true,
    schema: true,
    schemaName: 'ProjectSubCategory',
    type: mongoose.Schema.Types.ObjectId || String,
    ref: 'ProjectSubCategory',
  })
  public subCategory: TProjectSubCategory | string;
  @Prop({ required: true })
  public startDate: Date;
  @Prop({ type: [Date || undefined], default: undefined })
  public endDate: Date | undefined;
  @Prop({
    default: [],
    schema: true,
    schemaName: 'Feature',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'Feature',
  })
  public features: (TFeature | string)[];
  @Prop({
    default: [],
    schema: true,
    schemaName: 'Requeriment',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'Requeriment',
  })
  public requeriments: (TRequeriment | string)[];
  @Prop({ required: true })
  public approximateTimeProjection: number;
  @Prop({
    required: true,
    schema: true,
    schemaName: 'Status',
    type: mongoose.Schema.Types.ObjectId || String,
    ref: 'Status',
  })
  public status: TStatus | string;
  @Prop({ required: true })
  public lastCheckStatus: Date;
  @Prop({
    default: [],
    schema: true,
    schemaName: 'Task',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'Task',
  })
  public tasks: (TTask | string)[];
  @Prop({ required: true })
  public priority: number;
  @Prop({ required: true })
  public impact: number;
  @Prop({ required: true })
  public impactDescription: string;
  @Prop({ default: false })
  public completed: boolean;
  @Prop({ default: Date.now })
  public createdAt: Date;
  @Prop({ default: Date.now })
  public updatedAt: Date;
  @Prop({ default: '' })
  public bgColor: string;
  @Prop({ default: '' })
  public textColor: string;
  @Prop({ default: '' })
  public linkColor: string;
  @Prop({ default: '' })
  secondaryBgColor: string;
  @Prop({ default: '' })
  secondaryTextColor: string;
  @Prop({ default: '' })
  secondaryLinkColor: string;
  @Prop({ default: '' })
  accentColor: string;
}
export const projectSchema = SchemaFactory.createForClass(Project);
export type ProjectDocument = HydratedDocument<Project>;
export type ProjectModel = Model<Project>;
