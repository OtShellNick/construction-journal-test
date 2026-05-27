import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkTypesService } from './work-types.service';

/**
 * Контроллер для работы с видами работ.
 * Предоставляет GET-эндпоинт по пути /work-types.
 */
@ApiTags('work-types')
@Controller({
  path: 'work-types',
  version: '1',
})
export class WorkTypesController {
  constructor(private readonly service: WorkTypesService) {}

  /** Возвращает список всех видов работ, отсортированных по имени. */
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
