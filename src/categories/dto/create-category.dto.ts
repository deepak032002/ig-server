import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Sports',
    description: 'Name of the category',
    required: true,
  })
  @IsNotEmpty()
  name: string;
}
