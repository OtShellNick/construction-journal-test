import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model, SortOrder, Types } from 'mongoose';

import { Entry, EntryDocument } from './entry.schema';
import { CreateEntryDto } from './dto/create-entry.dto';
import { QueryEntryDto } from './dto/query-entry.dto';

@Injectable()
export class EntriesService {
  private readonly workTypePopulate = {
    path: 'workTypeId',
    select: 'name unit',
  };

  constructor(
    @InjectModel(Entry.name)
    private readonly entryModel: Model<EntryDocument>,
  ) {}

  async findAll(query: QueryEntryDto) {
    const filter = this.buildFilter(query);
    const sort = this.buildSort(query);

    return this.entryModel
      .find(filter)
      .sort(sort)
      .populate(this.workTypePopulate)
      .lean()
      .exec();
  }

  async findOne(id: string) {
    const entry = await this.entryModel
      .findById(id)
      .populate(this.workTypePopulate)
      .lean()
      .exec();

    this.ensureExists(entry, id);

    return entry;
  }

  async create(dto: CreateEntryDto) {
    const preparedData = this.prepareEntryData(dto);

    const created = await this.entryModel.create(preparedData);

    return created.populate(this.workTypePopulate);
  }

  async update(id: string, dto: CreateEntryDto) {
    const preparedData = this.prepareEntryData(dto);

    const updated = await this.entryModel
      .findByIdAndUpdate(id, preparedData, {
        new: true,
        runValidators: true,
      })
      .populate(this.workTypePopulate)
      .lean()
      .exec();

    this.ensureExists(updated, id);

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.entryModel.findByIdAndDelete(id).exec();

    this.ensureExists(deleted, id);
  }

  private buildFilter(query: QueryEntryDto): QueryFilter<Entry> {
    const filter: QueryFilter<Entry> = {};

    if (query.from || query.to) {
      const from = query.from ? new Date(query.from) : undefined;
      const to = query.to ? new Date(query.to) : undefined;

      if (from && isNaN(from.getTime())) {
        throw new BadRequestException(
          `Неверный формат даты "from": "${query.from}"`,
        );
      }
      if (to && isNaN(to.getTime())) {
        throw new BadRequestException(
          `Неверный формат даты "to": "${query.to}"`,
        );
      }

      filter.date = {
        ...(from && { $gte: from }),
        ...(to && { $lte: to }),
      };
    }

    return filter;
  }

  private buildSort(query: QueryEntryDto): Record<string, SortOrder> {
    return {
      [query.sort || 'date']: query.order === 'asc' ? 1 : -1,
    };
  }

  private prepareEntryData(dto: CreateEntryDto) {
    return {
      ...dto,
      date: new Date(dto.date),
      workTypeId: new Types.ObjectId(dto.workTypeId),
    };
  }

  private ensureExists(entity: unknown, id: string): asserts entity {
    if (!entity) {
      throw new NotFoundException(`Запись ${id} не найдена`);
    }
  }
}
