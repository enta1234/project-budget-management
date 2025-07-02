import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Setting extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ type: SchemaTypes.Mixed })
  value: any;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
