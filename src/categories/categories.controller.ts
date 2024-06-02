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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadType } from '../core/upload-file-type';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.find();
  }

  @Get(':categoryId')
  findOne(@Param('categoryId') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor(UploadType.COVER))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    return this.categoriesService.create(createCategoryDto, { cover });
  }

  @Patch(':categoryId')
  @UseInterceptors(FileInterceptor(UploadType.COVER))
  update(
    @Param('categoryId') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, { cover });
  }

  @Delete(':categoryId')
  delete(@Param('categoryId') id: string) {
    return this.categoriesService.delete(id);
  }

  @Get('utils/map')
  getMap() {
    return this.categoriesService.getMap();
  }
}
