export class CreateLessonDto {
    id: string;
    title: string;
    cover?: string;
    content: string;
    categoryId: string;
}