import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { getModelToken } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';

describe('LessonsService', () => {
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

  const mockLessonModel = {
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
        LessonsService,
        {
          provide: getModelToken(Lesson.name),
          useValue: mockLessonModel,
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create lesson', () => {
    it('should create a lesson on success', async () => {
      const expectedResult = LESSON_INT;
      const dto: CreateLessonDto = {
        id: 'integer',
        title: 'Integer',
        categoryId: 'math',
        content: '',
      };
      mockLessonModel.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);

      expect(mockLessonModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('find lesson', () => {
    it('should return lesson with ID "integer" on success', async () => {
      const expectedResult = LESSON_INT;
      mockLessonModel.findOne.mockResolvedValue(expectedResult);

      const result = await service.findOne(MOCK_CATEGORY_ID, MOCK_LESSON_ID);

      expect(mockLessonModel.findOne).toHaveBeenCalledWith({
        id: MOCK_LESSON_ID,
        categoryId: MOCK_CATEGORY_ID,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('find all lessons', () => {
    it('should return all lesson', async () => {
      const expectedResult = [LESSON_INT];
      mockLessonModel.find.mockResolvedValue(expectedResult);

      const result = await service.find();

      expect(mockLessonModel.find).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update lesson', () => {
    it('should update lesson', async () => {
      let LESSON_INT_UPDATE = LESSON_INT;
      const newTitle = 'New integer';
      LESSON_INT_UPDATE.title = newTitle;
      const expectedResult = LESSON_INT_UPDATE;
      mockLessonModel.findOneAndUpdate.mockResolvedValue(expectedResult);

      const result = await service.update(MOCK_CATEGORY_ID, MOCK_LESSON_ID, {
        title: newTitle,
      });

      expect(mockLessonModel.findOneAndUpdate).toHaveBeenCalledWith(
        {
          id: MOCK_LESSON_ID,
          categoryId: MOCK_CATEGORY_ID,
        },
        { title: newTitle },
        { new: true },
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete lesson', () => {
    it('should delete lesson', async () => {
      const expectedResult = LESSON_INT;
      mockLessonModel.findOneAndDelete.mockResolvedValue(expectedResult);

      const result = await service.delete(MOCK_CATEGORY_ID, MOCK_LESSON_ID);

      expect(mockLessonModel.findOneAndDelete).toHaveBeenCalledWith({
        id: MOCK_LESSON_ID,
        categoryId: MOCK_CATEGORY_ID,
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
