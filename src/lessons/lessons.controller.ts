import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadType } from '../core/upload-file-type';

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
  @UseInterceptors(FileInterceptor(UploadType.COVER))
  create(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    return this.lessonsService.create(createLessonDto, { cover });
  }

  @Patch(':categoryId/:lessonId')
  @UseInterceptors(FileInterceptor(UploadType.COVER))
  update(
    @Param('categoryId') categoryId: string,
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    return this.lessonsService.update(categoryId, lessonId, updateLessonDto, {
      cover,
    });
  }

  @Delete(':categoryId/:lessonId')
  delete(
    @Param('categoryId') categoryId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonsService.delete(categoryId, lessonId);
  }
}
