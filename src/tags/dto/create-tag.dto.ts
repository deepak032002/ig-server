import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Name of the tag',
    example: 'Sports',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
