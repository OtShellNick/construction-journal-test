import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { EntriesService } from './entries.service';

import { CreateEntryDto } from './dto/create-entry.dto';
import { QueryEntryDto } from './dto/query-entry.dto';

/**
 * Контроллер для управления записями журнала работ.
 * Предоставляет CRUD-эндпоинты по пути /entries.
 */
@ApiTags('entries')
@Controller({
  path: 'entries',
  version: '1',
})
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  /** Получить список записей с фильтрацией и сортировкой. */
  @Get()
  @ApiOperation({
    summary: 'Получить список записей с фильтрацией и сортировкой',
  })
  @ApiOkResponse({
    description: 'Список записей успешно получен',
  })
  findAll(@Query() query: QueryEntryDto) {
    return this.entriesService.findAll(query);
  }

  /** Получить одну запись по идентификатору. */
  @Get(':id')
  @ApiOperation({ summary: 'Получить запись по ID' })
  @ApiOkResponse({ description: 'Запись успешно получена' })
  @ApiNotFoundResponse({ description: 'Запись не найдена' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.entriesService.findOne(id);
  }

  /** Создать новую запись журнала. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать запись' })
  @ApiCreatedResponse({ description: 'Запись успешно создана' })
  @ApiBadRequestResponse({ description: 'Неверные данные' })
  create(@Body() dto: CreateEntryDto) {
    return this.entriesService.create(dto);
  }

  /** Обновить существующую запись по идентификатору. */
  @Put(':id')
  @ApiOperation({ summary: 'Обновить запись' })
  @ApiOkResponse({ description: 'Запись успешно обновлена' })
  @ApiNotFoundResponse({ description: 'Запись не найдена' })
  @ApiBadRequestResponse({ description: 'Неверные данные' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: CreateEntryDto,
  ) {
    return this.entriesService.update(id, dto);
  }

  /** Удалить запись по идентификатору. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить запись' })
  @ApiNoContentResponse({ description: 'Запись успешно удалена' })
  @ApiNotFoundResponse({ description: 'Запись не найдена' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.entriesService.remove(id);
  }
}
