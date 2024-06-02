import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Photo } from './schemas/photo.schema';
describe('PhotosService', () => {
  let service: PhotosService;

  // const MOCK_PHOTO = {
  //   path: 'a.jpg'
  // }

  const mockPhotoModel = {
    // create: jest.fn(),
    find: jest.fn(),
    findOneAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: getModelToken(Photo.name),
          useValue: mockPhotoModel,
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
