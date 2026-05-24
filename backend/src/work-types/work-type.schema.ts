import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WorkTypeDocument = HydratedDocument<WorkType>;

@Schema({ timestamps: true, collection: 'work_types' })
export class WorkType {
  @Prop({ required: true, unique: true, trim: true, type: String })
  name: string = '';

  @Prop({ required: true, trim: true, type: String })
  unit: string = '';
}

export const WorkTypeSchema = SchemaFactory.createForClass(WorkType);
