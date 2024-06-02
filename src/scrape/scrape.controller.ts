import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateScrapeDto, DeleteScrapeDto } from './dto/index.dto';
import { AuthGuard } from 'src/Decorators/guards/auth.guard';
import { Roles, RolesGuard } from 'src/Decorators/guards/roles.guard';
import { Role } from 'src/types';

@ApiTags('Editorial')
@Controller('editorial')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Post('scrape')
  scrapeData(@Body() scrapeData: CreateScrapeDto) {
    return this.scrapeService.scrapeData(scrapeData);
  }

  @Roles([Role.ADMIN, Role.AUTHOR])
  @UseGuards(AuthGuard, RolesGuard)
  @Get('all')
  findAll(
    @Query(
      'page',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    page: number,
    @Query(
      'limit',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    limit: number,
    @Query('search')
    search: string,
  ) {
    return this.scrapeService.findAll(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scrapeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.scrapeService.update(+id);
  }

  @Delete()
  remove(@Body() body: DeleteScrapeDto) {
    return this.scrapeService.remove(body);
  }
}
