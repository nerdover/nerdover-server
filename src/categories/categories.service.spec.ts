import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const CATEGORY_MATH = {
    id: 'math',
    title: 'Math',
    createdAt: new Date('12-12-2001'),
    updated: new Date('12-12-2002'),
  };

  const mockCategoryModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    // aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create category', () => {
    it('should create a category on success', async () => {
      const expectedResult = CATEGORY_MATH;
      const dto: CreateCategoryDto = { id: 'math', title: 'Math' };
      mockCategoryModel.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);

      expect(mockCategoryModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('find category', () => {
    it('should return category id "math" on success', async () => {
      const expectedResult = CATEGORY_MATH;
      const id = 'math';
      mockCategoryModel.findOne.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);

      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({ id });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('find all categories', () => {
    it('should return all categories', async () => {
      const expectedResult = [CATEGORY_MATH];
      mockCategoryModel.find.mockResolvedValue(expectedResult);

      const result = await service.find();

      expect(mockCategoryModel.find).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update category', () => {
    it('should update category', async () => {
      const CATEGORY_MATH_UPDATE = {
        id: 'math',
        title: 'Math 2',
      };
      const expectedResult = CATEGORY_MATH_UPDATE;
      const id = 'math';
      mockCategoryModel.findOneAndUpdate.mockResolvedValue(expectedResult);

      const result = await service.update(id, { title: 'Math 2' });

      expect(mockCategoryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id },
        { title: 'Math 2' },
        { new: true },
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete category', () => {
    it('should delete category', async () => {
      const expectedResult = CATEGORY_MATH;
      const id = 'math';
      mockCategoryModel.findOneAndDelete.mockResolvedValue(expectedResult);

      const result = await service.delete(id);

      expect(mockCategoryModel.findOneAndDelete).toHaveBeenCalledWith({ id });
      expect(result).toEqual(expectedResult);
    });
  });
});
