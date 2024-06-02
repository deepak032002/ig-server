import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export enum ScrapeOption {
  THE_HINDU,
  DRISHTI_IAS,
}

export class CreateScrapeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ScrapeOption, { message: 'Invalid option' })
  option: ScrapeOption;
}

export class DeleteScrapeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray({ message: 'id should be an array' })
  id: string[];
}
