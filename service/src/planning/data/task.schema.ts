import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Phase } from './phase.schema';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Phase.name })
  phase: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isFeature: boolean;

  @Prop()
  detail?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  owner?: string;

  @Prop()
  manday?: number;

  @Prop({ type: Types.ObjectId, ref: Task.name })
  blockedBy?: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
