import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
  ],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
