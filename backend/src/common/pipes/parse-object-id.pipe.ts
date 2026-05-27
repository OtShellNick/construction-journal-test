import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

/**
 * Пайп для валидации строкового MongoDB ObjectId.
 * Выбрасывает BadRequestException, если значение не является валидным ObjectId.
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  /**
   * Проверяет корректность переданного ObjectId.
   * @param value - Строковое представление ObjectId
   * @returns Исходная строка, если она валидна
   * @throws BadRequestException если формат ID неверен
   */
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Неверный формат ID: "${value}"`);
    }
    return value;
  }
}
