import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const createdLesson = await this.lessonModel.create(createLessonDto);
      return createdLesson;
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException('Duplicated Lesson ID');
      }
      throw err;
    }
  }

  async find() {
    const lessons = await this.lessonModel.find();
    if (!lessons) {
      throw new NotFoundException('Lessons are not found');
    }
    return lessons;
  }

  async findOne(categoryId: string, lessonId: string) {
    const foundLesson = await this.lessonModel.findOne({
      id: lessonId,
      categoryId,
    });
    if (!foundLesson) {
      throw new NotFoundException(`Lesson with ID=${lessonId} is not found`);
    }
    return foundLesson;
  }

  async update(
    categoryId: string,
    lessonId: string,
    updateLessonDto: UpdateLessonDto,
  ) {
    try {
      const updatedLesson = await this.lessonModel.findOneAndUpdate(
        { id: lessonId, categoryId },
        updateLessonDto,
        {
          new: true,
        },
      );
      if (!updatedLesson) {
        throw new NotFoundException(`Lesson with ID=${lessonId} is not found`);
      }
      return updatedLesson;
    } catch (err) {
      throw err;
    }
  }

  async delete(categoryId: string, lessonId: string) {
    try {
      const deletedLesson = await this.lessonModel.findOneAndDelete({
        id: lessonId,
        categoryId,
      });
      if (!deletedLesson) {
        throw new NotFoundException(`Lesson with ID=${lessonId} is not found`);
      }
      return deletedLesson;
    } catch (err) {
      throw err;
    }
  }
}
