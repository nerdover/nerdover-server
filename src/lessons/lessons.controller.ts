import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('api/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll() {
    return this.lessonsService.find();
  }

  @Get(':categoryId/:lessonId')
  findOne(
    @Param('categoryId') categoryId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonsService.findOne(categoryId, lessonId);
  }

  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Patch(':categoryId/:lessonId')
  update(
    @Param('categoryId') categoryId: string,
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(categoryId, lessonId, updateLessonDto);
  }

  @Delete(':categoryId/:lessonId')
  delete(
    @Param('categoryId') categoryId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonsService.delete(categoryId, lessonId);
  }
}
