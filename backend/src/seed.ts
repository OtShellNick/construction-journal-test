import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkType } from './work-types/work-type.schema';

const WORK_TYPES = [
  { name: 'Кладка перегородок', unit: 'м²' },
  { name: 'Монтаж опалубки', unit: 'м²' },
  { name: 'Заливка бетона', unit: 'м³' },
  { name: 'Армирование', unit: 'кг' },
  { name: 'Монтаж кровли', unit: 'м²' },
  { name: 'Штукатурные работы', unit: 'м²' },
  { name: 'Укладка плитки', unit: 'м²' },
  { name: 'Устройство полов', unit: 'м²' },
  { name: 'Монтаж окон', unit: 'шт' },
  { name: 'Электромонтажные работы', unit: 'п.м.' },
  { name: 'Сантехнические работы', unit: 'п.м.' },
  { name: 'Земляные работы', unit: 'м³' },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const model = app.get<Model<WorkType>>(getModelToken(WorkType.name));

  for (const wt of WORK_TYPES) {
    await model.updateOne({ name: wt.name }, { $set: wt }, { upsert: true });
  }

  await app.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
