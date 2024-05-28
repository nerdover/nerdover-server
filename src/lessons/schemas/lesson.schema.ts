import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ unique: true })
  id: string;

  @Prop()
  title: string;

  @Prop()
  cover?: string;

  @Prop()
  content: string;

  @Prop()
  categoryId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
