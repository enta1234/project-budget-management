import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Milestone extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
