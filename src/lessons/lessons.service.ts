import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    return this.lessonModel.create(createLessonDto);
  }

  async find() {
    return this.lessonModel.find();
  }

  async findOne(categoryId: string, lessonId: string) {
    return this.lessonModel.findOne({ id: lessonId, categoryId });
  }

  async update(
    categoryId: string,
    lessonId: string,
    updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonModel.findOneAndUpdate(
      { id: lessonId, categoryId },
      updateLessonDto,
      {
        new: true,
      },
    );
  }

  async delete(categoryId: string, lessonId: string) {
    return this.lessonModel.findOneAndDelete({ id: lessonId, categoryId });
  }
}
