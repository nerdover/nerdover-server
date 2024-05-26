import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  async find() {
    const categories = await this.categoryModel.find();
    return categories;
  }

  async findOne(id: string) {
    return this.categoryModel.findOne({ id });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findOneAndUpdate({ id }, updateCategoryDto, {
      new: true,
    });
  }

  async delete(id: string) {
    return this.categoryModel.findOneAndDelete({ id });
  }
}
