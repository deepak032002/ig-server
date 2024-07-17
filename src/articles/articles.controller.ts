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
  Req,
  BadRequestException,
} from '@nestjs/common'
import { ArticlesService } from './articles.service'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CreateArticleDto, CreateScrapeDto, DeleteScrapeDto } from './dto/index.dto'
import { AuthGuard } from 'src/Decorators/guards/auth.guard'
import { Roles, RolesGuard } from 'src/Decorators/guards/roles.guard'
import { Role } from 'src/types'
import { RequestWithUser } from 'src/user/interface'

@ApiTags('Articles')
@Controller('articles')
export class ScrapeController {
  constructor(private readonly articleService: ArticlesService) {}

  @ApiBearerAuth()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Post('scrape')
  scrapeData(@Body() scrapeData: CreateScrapeDto) {
    return this.articleService.scrapeData(scrapeData)
  }

  @ApiQuery({ name: 'search', required: false })
  @Get('all')
  findAll(
    @Query(
      'page',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
        exceptionFactory: () => new BadRequestException('Invalid page'),
      }),
    )
    page: number,
    @Query(
      'limit',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
        exceptionFactory: () => new BadRequestException('Invalid limit'),
      }),
    )
    limit: number,
    @Query('search')
    search: string,
  ) {
    return this.articleService.findAll(page, limit, search)
  }

  @ApiBearerAuth()
  @Roles([Role.ADMIN, Role.AUTHOR])
  @UseGuards(AuthGuard, RolesGuard)
  @Post('')
  addNewArticle(@Body() body: CreateArticleDto, @Req() req: RequestWithUser) {
    return this.articleService.addNewArticle(body, req)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id)
  }

  @ApiBearerAuth()
  @Roles([Role.ADMIN, Role.AUTHOR])
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string) {
    return this.articleService.update(+id)
  }

  @ApiBearerAuth()
  @Roles([Role.ADMIN, Role.AUTHOR])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete()
  remove(@Body() body: DeleteScrapeDto) {
    return this.articleService.remove(body)
  }
}
