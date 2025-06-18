import { HydratedDocument, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
/* Types */
import { TUser } from '@src/user/types/user.type';
import { TProject } from '../types/project.type';
import { TTask } from '../types/task.type';
import { TRequeriment } from '../types/requeriment.type';
import { TFeature } from '../types/feature.type';
import { TStatus } from '../types/status.type';
@Schema()
export class Task implements Omit<TTask, '_id'> {
  @Prop({
    default: [],
    schema: true,
    schemaName: 'User',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'User',
  })
  public assignedUsers: (TUser | string)[];
  @Prop({ required: true })
  public name: string;
  @Prop({ required: true })
  public description: string;
  @Prop({
    required: true,
    schema: true,
    schemaName: 'Status',
    type: mongoose.Schema.Types.ObjectId || String,
    ref: 'Status',
  })
  public status: TStatus | string;
  @Prop({
    default: [],
    schema: true,
    schemaName: 'Task',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'Task',
  })
  public tasks: (TTask | string)[];
  @Prop({ required: true })
  public startDate: Date;
  @Prop({ required: true })
  public endDate: Date;
  @Prop({ default: Date.now })
  public lastCheckStatus: Date;
  @Prop({ required: true })
  public approximateTimeProjection: number;
  @Prop({ required: true })
  public priority: number;
  @Prop({ required: true })
  public impact: number;
  @Prop({ required: true })
  public impactDescription: string;
  @Prop({
    default: [],
    schema: true,
    schemaName: 'Project',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'Project',
  })
  public prevProjects: (TProject | string)[];
  @Prop({
    default: [],
    schema: true,
    schemaName: 'Task',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'Task',
  })
  public prevTasks: (TTask | string)[];
  @Prop({
    default: [],
    schema: true,
    schemaName: 'Requeriment',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'Requeriment',
  })
  public prevRequeriments: (TRequeriment | string)[];
  @Prop({
    default: [],
    schema: true,
    schemaName: 'Feature',
    type: [mongoose.Schema.Types.ObjectId || String],
    ref: 'Feature',
  })
  public prevFeatures: (TFeature | string)[];
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
export const taskSchema = SchemaFactory.createForClass(Task);
export type TaskDocument = HydratedDocument<Task>;
export type TaskModel = Model<Task>;
