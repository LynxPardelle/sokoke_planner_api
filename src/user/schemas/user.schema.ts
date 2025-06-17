import { HydratedDocument, Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { TUser } from '../types/user.type';
@Schema()
export class User implements Omit<TUser, '_id'> {
  @Prop({ required: true })
  public name: string;
  @Prop({ required: true })
  public lastName: string;
  @Prop({ required: true })
  public email: string;
  @Prop({ required: true })
  public username: string;
  @Prop({ required: true })
  public password: string;
  @Prop({ default: Date.now })
  public createdAt: Date;
  @Prop({ default: Date.now })
  public updatedAt: Date;
  @Prop({ default: '' })
  public verifyToken: string;
  @Prop({ required: true, default: false })
  public verified: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;
