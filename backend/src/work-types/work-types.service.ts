import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkType, WorkTypeDocument } from './work-type.schema';

@Injectable()
export class WorkTypesService {
  constructor(
    @InjectModel(WorkType.name)
    private readonly model: Model<WorkTypeDocument>,
  ) {}

  findAll(): Promise<WorkTypeDocument[]> {
    return this.model.find().sort({ name: 1 }).lean().exec();
  }
}
