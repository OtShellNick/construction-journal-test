import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkType, WorkTypeSchema } from './work-type.schema';
import { WorkTypesController } from './work-types.controller';
import { WorkTypesService } from './work-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkType.name, schema: WorkTypeSchema },
    ]),
  ],
  controllers: [WorkTypesController],
  providers: [WorkTypesService],
})
export class WorkTypesModule {}
