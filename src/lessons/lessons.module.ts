import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PhotosModule } from '../photos/photos.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    PhotosModule,
  ],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
