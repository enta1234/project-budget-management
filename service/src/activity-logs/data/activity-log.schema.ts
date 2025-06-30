import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ActivityLog extends Document {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Object })
  body: Record<string, unknown>;

  @Prop({ required: true })
  statusCode: number;

  @Prop({ required: true })
  processTime: number;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  name: string;

  @Prop()
  detail: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
