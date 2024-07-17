import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNotEmpty, MinLength } from 'class-validator'

export enum ScrapeOption {
  THE_HINDU,
  INDIAN_EXPRESS,
}

export class CreateScrapeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ScrapeOption, { message: 'Invalid option' })
  option: ScrapeOption
}

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  title: string

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(60)
  description: string

  @ApiProperty()
  @IsNotEmpty()
  content: string

  @ApiProperty()
  thumbnail: string

  @ApiProperty()
  @IsNotEmpty()
  category: string

  @ApiProperty()
  @IsNotEmpty()
  tag: string[]

  @ApiProperty()
  metaTitle: string

  @ApiProperty()
  metaDescription: string
}

export class DeleteScrapeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray({ message: 'id should be an array' })
  id: string[]
}
