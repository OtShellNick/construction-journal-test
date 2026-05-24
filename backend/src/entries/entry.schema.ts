import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { WorkType } from '../work-types/work-type.schema';

export type EntryDocument = HydratedDocument<Entry>;

@Schema({ timestamps: true, collection: 'entries' })
export class Entry {
  @Prop({ required: true, type: Date })
  date!: Date;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: WorkType.name,
  })
  workTypeId!: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 0.01 })
  volume: number = 0.01;

  @Prop({ type: String, required: true, trim: true, maxlength: 20 })
  unit: string = '';

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  executor: string = '';

  @Prop({
    type: String,
    allowNull: true,
    trim: true,
    maxlength: 500,
    default: null,
  })
  notes: string | null = null;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);

EntrySchema.index({ date: -1 });
