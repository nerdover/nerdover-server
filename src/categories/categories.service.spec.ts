import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const CATEGORY_MATH: Category = {
    id: 'math',
    title: 'Math',
    createdAt: new Date('12-12-2001'),
    updatedAt: new Date('12-12-2002'),
  };

  const MOCK_CATEGORY_ID = 'math';

  const MOCK_MAP = [
    {
      id: 'math',
      lessons: [
        {
          id: 'integer'
        }
      ]
    }
  ]

  const mockCategoryModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    aggregate: jest.fn(),
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

  afterEach(async () => {
    jest.clearAllMocks();
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

    it('should throw error if create duplicated category', async () => {
      const dto: CreateCategoryDto = { id: 'math', title: 'Math' };
      mockCategoryModel.create.mockRejectedValue({ code: 11000 });

      const result = service.create(dto);

      await expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('find category', () => {
    it('should return category id "math" on success', async () => {
      const expectedResult = CATEGORY_MATH;
      mockCategoryModel.findOne.mockResolvedValue(expectedResult);

      const result = await service.findOne(MOCK_CATEGORY_ID);

      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
        id: MOCK_CATEGORY_ID,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if found category is null', async () => {
      mockCategoryModel.findOne.mockResolvedValue(null);

      const result = service.findOne(MOCK_CATEGORY_ID);

      await expect(result).rejects.toThrow(NotFoundException);
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

    it('should throw error if categories are null', async () => {
      mockCategoryModel.find.mockResolvedValue(null);

      const result = service.find();

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('update category', () => {
    it('should update category', async () => {
      const CATEGORY_MATH_UPDATE = CATEGORY_MATH;
      const newTitle = 'New math';
      CATEGORY_MATH_UPDATE.title = newTitle;
      const expectedResult = CATEGORY_MATH_UPDATE;
      mockCategoryModel.findOneAndUpdate.mockResolvedValue(expectedResult);

      const result = await service.update(MOCK_CATEGORY_ID, {
        title: newTitle,
      });

      expect(mockCategoryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: MOCK_CATEGORY_ID },
        { title: newTitle },
        { new: true },
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if found category is null', async () => {
      mockCategoryModel.findOneAndUpdate.mockResolvedValue(null);

      const result = service.update(MOCK_CATEGORY_ID, { title: 'New math' });

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw error if update is unsuccessful', async () => {
      mockCategoryModel.findOneAndUpdate.mockRejectedValue(new Error());

      const result = service.update(MOCK_CATEGORY_ID, { title: 'New Math' });

      await expect(result).rejects.toThrow(Error);
    });
  });

  describe('delete category', () => {
    it('should delete category', async () => {
      const expectedResult = CATEGORY_MATH;
      mockCategoryModel.findOneAndDelete.mockResolvedValue(expectedResult);

      const result = await service.delete(MOCK_CATEGORY_ID);

      expect(mockCategoryModel.findOneAndDelete).toHaveBeenCalledWith({
        id: MOCK_CATEGORY_ID,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if found category is null', async () => {
      mockCategoryModel.findOneAndDelete.mockResolvedValue(null);

      const result = service.delete(MOCK_CATEGORY_ID);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw error if delete is unsuccessful', async () => {
      mockCategoryModel.findOneAndDelete.mockRejectedValue(new Error());

      const result = service.delete(MOCK_CATEGORY_ID);

      await expect(result).rejects.toThrow(Error);
    });
  });

  describe('get map of lesson overview', () => {
    it('should return a map of lesson overview', async () => {
      const expectedResult = MOCK_MAP
      mockCategoryModel.aggregate.mockResolvedValue(MOCK_MAP)

      const result = await service.getMap();

      expect(result).toEqual(expectedResult)
    })

    it('should throw error if get map is unsuccessful', async () => {
      mockCategoryModel.aggregate.mockRejectedValue(new Error())

      const result = service.getMap();

      await expect(result).rejects.toThrow(Error)
    })
  })
});
