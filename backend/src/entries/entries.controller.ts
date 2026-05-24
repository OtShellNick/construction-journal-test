import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EntriesService } from './entries.service';

import { CreateEntryDto } from './dto/create-entry.dto';
import { QueryEntryDto } from './dto/query-entry.dto';

@ApiTags('entries')
@Controller({
  path: 'entries',
  version: '1',
})
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

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

  @Get(':id')
  @ApiOperation({
    summary: 'Получить запись по ID',
  })
  @ApiOkResponse({
    description: 'Запись успешно получена',
  })
  findOne(@Param('id') id: string) {
    return this.entriesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Создать запись',
  })
  @ApiOkResponse({
    description: 'Запись успешно создана',
  })
  create(@Body() dto: CreateEntryDto) {
    return this.entriesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Обновить запись',
  })
  @ApiOkResponse({
    description: 'Запись успешно обновлена',
  })
  update(@Param('id') id: string, @Body() dto: CreateEntryDto) {
    return this.entriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удалить запись',
  })
  @ApiNoContentResponse({
    description: 'Запись успешно удалена',
  })
  remove(@Param('id') id: string) {
    return this.entriesService.remove(id);
  }
}
