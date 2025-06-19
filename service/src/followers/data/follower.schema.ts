import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Follower extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
