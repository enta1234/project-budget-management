import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  resources: number;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop()
  manday: number;

  @Prop()
  sprintLength: number;

  @Prop({ required: true })
  priority: number;

  @Prop({ type: Types.ObjectId, ref: 'Resource' })
  lead: Types.ObjectId;

  @Prop()
  status: string;

  @Prop({ type: [String], default: [] })
  members: string[];

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 0 });
