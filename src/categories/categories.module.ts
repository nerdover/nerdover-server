import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
