import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { getModelToken } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  afterEach(async () => {
    jest.clearAllMocks();
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

    it('should throw error if create duplicated lesson', async () => {
      const dto: CreateLessonDto = {
        id: 'integer',
        title: 'Integer',
        categoryId: 'math',
        content: '',
      };
      mockLessonModel.create.mockRejectedValue({ code: 11000 });

      const result = service.create(dto);

      await expect(result).rejects.toThrow(BadRequestException);
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

    it('should throw error if found lesson is null', async () => {
      mockLessonModel.findOne.mockResolvedValue(null);

      const result = service.findOne(MOCK_CATEGORY_ID, MOCK_LESSON_ID);

      await expect(result).rejects.toThrow(NotFoundException);
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

    it('should throw error if lessons are null', async () => {
      mockLessonModel.find.mockResolvedValue(null);

      const result = service.find();

      await expect(result).rejects.toThrow(NotFoundException);
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

    it('should throw error if found lesson is null', async () => {
      mockLessonModel.findOneAndUpdate.mockResolvedValue(null);

      const result = service.update(MOCK_CATEGORY_ID, MOCK_LESSON_ID, {
        title: 'New integer',
      });

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw error if update is unsuccessful', async () => {
      mockLessonModel.findOneAndUpdate.mockRejectedValue(new Error());

      const result = service.update(MOCK_CATEGORY_ID, MOCK_LESSON_ID, {
        title: 'New integer',
      });

      await expect(result).rejects.toThrow(Error);
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

    it('should throw error if found lesson is null', async () => {
      mockLessonModel.findOneAndDelete.mockResolvedValue(null);

      const result = service.delete(MOCK_CATEGORY_ID, MOCK_LESSON_ID);

      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw error if delete is unsuccessful', async () => {
      mockLessonModel.findOneAndDelete.mockRejectedValue(new Error());

      const result = service.delete(MOCK_CATEGORY_ID, MOCK_LESSON_ID);

      await expect(result).rejects.toThrow(Error);
    });
  });
});
