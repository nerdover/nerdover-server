import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategoriesService = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getMap: jest.fn(),
  };

  const MOCK_MAP = [
    {
      id: 'math',
      lessons: [
        {
          id: 'integer',
        },
      ],
    },
  ];

  const CATEGORY_MATH = {
    id: 'math',
    title: 'Math',
    cover: 'a',
    createdAt: new Date('12-12-2001'),
    updatedAt: new Date('12-12-2002'),
  };

  const MOCK_CATEGORY_ID = 'math';

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
      mockCategoriesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(MOCK_CATEGORY_ID);

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
      const CATEGORY_MATH_UPDATE = CATEGORY_MATH;
      const newTitle = 'New math';
      CATEGORY_MATH_UPDATE.title = newTitle;
      const expectedResult = CATEGORY_MATH_UPDATE;
      mockCategoriesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(MOCK_CATEGORY_ID, {
        title: 'Math 2',
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const expectedResult = CATEGORY_MATH;
      mockCategoriesService.delete.mockResolvedValue(expectedResult);

      const result = await controller.delete(MOCK_CATEGORY_ID);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('get lesson map', () => {
    it('should return lesson map', async () => {
      const expectedResult = [MOCK_MAP];
      mockCategoriesService.getMap.mockResolvedValue(expectedResult);

      const result = await controller.getMap();

      expect(result).toEqual(expectedResult);
    });
  });
});
