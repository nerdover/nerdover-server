import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Photo } from './schemas/photo.schema';
import { Model } from 'mongoose';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo.name) private readonly photoModel: Model<Photo>,
  ) {}
  
  async create(file: Express.Multer.File) {
    return await this.photoModel.create({ path: file.filename });
  }

  async findAll() {
    return await this.photoModel.find().sort({ _id: 'desc' });
  }

  async remove(path: string) {
    return await this.photoModel.findOneAndDelete({ path });
  }
}
