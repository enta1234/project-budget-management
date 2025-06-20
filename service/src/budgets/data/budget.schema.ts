import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Budget extends Document {
  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  rate: number;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
