import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ required: true })
  manday: number;

  @Prop({ required: true })
  priority: number;

  @Prop()
  lead: string;

  @Prop()
  status: string;

  @Prop({ type: [String], default: [] })
  members: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
