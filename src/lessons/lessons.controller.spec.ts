import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Lesson } from './schemas/lesson.schema';

describe('LessonsController', () => {
  let controller: LessonsController;

  let service: LessonsService;

  const LESSON_INT: Lesson = {
    id: 'integer',
    title: 'Integer',
    categoryId: 'math',
    content: '',
    createdAt: new Date('12-12-2001'),
    updatedAt: new Date('12-12-2002'),
  };

  const MOCK_LESSON_ID = 'integer';
  const MOCK_CATEGORY_ID = 'math';

  const mockLessonsService = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
        {
          provide: LessonsService,
          useValue: mockLessonsService,
        },
      ],
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
    service = module.get<LessonsService>(LessonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of lessons', async () => {
      const expectedResult = [LESSON_INT];
      mockLessonsService.find.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a lesson', async () => {
      const expectedResult = LESSON_INT;
      mockLessonsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(MOCK_CATEGORY_ID, MOCK_LESSON_ID);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a lesson', async () => {
      const expectedResult = LESSON_INT;
      const dto: CreateLessonDto = {
        id: 'integer',
        title: 'Integer',
        content: '',
        categoryId: 'math',
      };
      mockLessonsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a lesson', async () => {
      let LESSON_INT_UPDATE = LESSON_INT;
      const newTitle = 'New integer';
      LESSON_INT_UPDATE.title = newTitle;
      const expectedResult = LESSON_INT_UPDATE;
      mockLessonsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(MOCK_CATEGORY_ID, MOCK_LESSON_ID, {
        title: newTitle,
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a lesson', async () => {
      const expectedResult = LESSON_INT;
      mockLessonsService.delete.mockResolvedValue(expectedResult);

      const result = await controller.delete(MOCK_CATEGORY_ID, MOCK_LESSON_ID);

      expect(result).toEqual(expectedResult);
    });
  });
});
