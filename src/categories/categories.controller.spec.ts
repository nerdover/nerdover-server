import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const CATEGORY_MATH = {
    id: 'math',
    title: 'Math',
    createdAt: new Date('12-12-2001'),
    updatedAt: new Date('12-12-2002'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of categories', async () => {
      const expectedResult = [CATEGORY_MATH];
      mockCategoriesService.find.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const expectedResult = CATEGORY_MATH;
      const id = 'math';
      mockCategoriesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a category', async () => {
      const expectedResult = CATEGORY_MATH;
      const dto: CreateCategoryDto = { id: 'math', title: 'Math' };
      mockCategoriesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const CATEGORY_MATH_UPDATE = {
        id: 'math',
        title: 'Math 2',
      };
      const expectedResult = CATEGORY_MATH_UPDATE;
      const id = 'math';
      mockCategoriesService.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, { title: 'Math 2' });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const expectedResult = CATEGORY_MATH;
      const id = 'math';
      mockCategoriesService.delete.mockResolvedValue(expectedResult);

      const result = await controller.delete(id);

      expect(result).toEqual(expectedResult);
    });
  });
});
