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

  @Prop({ enum: ['feature', 'milestone'], default: 'feature' })
  type: string;

  @Prop({ default: false })
  isFeature: boolean;

  @Prop()
  detail?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ type: [String], enum: ['SA', 'PA', 'QA'] })
  roles?: string[];

  @Prop()
  manday?: number;

  @Prop()
  duration?: number;

  @Prop({ type: Types.ObjectId, ref: Task.name })
  blockedBy?: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
