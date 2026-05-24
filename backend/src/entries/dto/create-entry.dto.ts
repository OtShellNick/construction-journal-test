import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEntryDto {
  @ApiProperty({ example: '2024-06-15', description: 'Дата выполнения работ' })
  @IsDateString()
  date!: string;

  @ApiProperty({ description: 'ID вида работ' })
  @IsMongoId()
  workTypeId!: string;

  @ApiProperty({ example: 24.5, description: 'Объём работ' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  volume: number = 0.01;

  @ApiProperty({ example: 'м²', description: 'Единица измерения' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  unit: string = '';

  @ApiProperty({
    example: 'Иванов Иван Иванович',
    description: 'ФИО исполнителя',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  executor: string = '';

  @ApiPropertyOptional({ example: 'Работы выполнены в осях 1-3' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
