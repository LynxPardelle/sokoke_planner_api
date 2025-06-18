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
  @Prop({ required: true, unique: true, lowercase: true })
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
  @Prop({ default: '', unique: true })
  public resetToken?: string;
  @Prop({ default: null })
  public resetTokenExpiry?: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;
