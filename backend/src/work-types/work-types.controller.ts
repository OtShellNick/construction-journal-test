import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkTypesService } from './work-types.service';

@ApiTags('work-types')
@Controller({
  path: 'work-types',
  version: '1',
})
export class WorkTypesController {
  constructor(private readonly service: WorkTypesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
