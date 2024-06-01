import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const createdCategory =
        await this.categoryModel.create(createCategoryDto);
      return createdCategory;
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException('Duplicated Category ID');
      }
      throw err;
    }
  }

  async find() {
    const categories = await this.categoryModel.find();
    if (!categories) {
      throw new NotFoundException('Categories are not found');
    }
    return categories;
  }

  async findOne(id: string) {
    const foundCategory = await this.categoryModel.findOne({ id });
    if (!foundCategory) {
      throw new NotFoundException(`Category with ID=${id} is not found`);
    }
    return foundCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.categoryModel.findOneAndUpdate(
        { id },
        updateCategoryDto,
        {
          new: true,
        },
      );

      if (!updatedCategory) {
        throw new NotFoundException(`Category with ID=${id} is not found`);
      }
      return updatedCategory;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string) {
    try {
      const deletedCategory = await this.categoryModel.findOneAndDelete({ id });

      if (!deletedCategory) {
        throw new NotFoundException(`Category with ID=${id} is not found`);
      }
      return deletedCategory;
    } catch (err) {
      throw err;
    }
  }

  async getMap() {
    try {
      const lessonMap = await this.categoryModel.aggregate([
        {
          $lookup: {
            from: 'lessons',
            localField: 'id',
            foreignField: 'categoryId',
            as: 'lessons',
          },
        },
        {
          $project: {
            _id: 0,
            id: '$id',
            title: '$title',
            cover: '$cover',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
            lessons: {
              $map: {
                input: '$lessons',
                as: 'lesson',
                in: {
                  id: '$$lesson.id',
                  title: '$$lesson.title',
                  categoryId: '$$lesson.categoryId',
                  createdAt: '$$lesson.createdAt',
                  updatedAt: '$$lesson.updatedAt',
                },
              },
            },
          },
        },
      ]);
      return lessonMap;
    } catch (err) {
      throw err;
    }
  }
}
