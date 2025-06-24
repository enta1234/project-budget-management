import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Workday extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;
}

export const WorkdaySchema = SchemaFactory.createForClass(Workday);
