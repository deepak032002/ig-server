import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateArticleDto, CreateScrapeDto, DeleteScrapeDto, ScrapeOption } from './dto/index.dto'
import { PrismaService } from 'src/prisma.service'
import { ScrapeFunctions } from 'src/articles/scrape.functions'
import { responseResult } from 'src/utils/response-result'
import { RequestWithUser } from 'src/user/interface'

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private scrapeFunctions: ScrapeFunctions,
  ) {}

  async scrapeData(scrapeData: CreateScrapeDto) {
    try {
      const option: ScrapeOption | undefined = scrapeData.option
      switch (option) {
        case ScrapeOption.THE_HINDU: {
          const latestHinduEditorialList = await this.scrapeFunctions.getListOfHinduEditorials()

          if (latestHinduEditorialList.length === 0) {
            return {
              success: true,
              message: 'Already fetched hindu editorial.',
            }
          }
          return {
            success: true,
            message: 'Fetched hindu editorial successfully.',
          }
        }

        case ScrapeOption.INDIAN_EXPRESS: {
          return 'indian express'
        }

        default: {
          return 'empty case'
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    // find articles with pagination
    const articles = await this.prisma.article.findMany({
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        thumbnail: true,
        viewersCount: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      where: {
        OR: [{ title: { contains: search, mode: 'insensitive' } }, { id: { contains: search, mode: 'insensitive' } }],
      },
    })

    const total = await this.prisma.article.count({
      where: {
        OR: [{ title: { contains: search, mode: 'insensitive' } }, { id: { contains: search, mode: 'insensitive' } }],
      },
    })

    if (articles.length === 0) {
      return responseResult({ articles, total }, true, 'Article not available')
    }

    return responseResult({ articles, total }, true, 'Article found successfully')
  }

  async addNewArticle(body: CreateArticleDto, req: RequestWithUser) {
    try {
      const isExistingTitle = await this.prisma.article.findFirst({
        where: { title: body.title },
      })

      if (isExistingTitle) {
        throw new BadRequestException('Title should be unique!')
      }

      await this.prisma.article.create({
        data: {
          title: body.title,
          content: body.content,
          metaDescription: body.metaDescription,
          metaTitle: body.metaTitle,
          thumbnail: body.thumbnail,
          category: {
            connect: { id: body.category },
          },
          tags: {
            connect: body.tag.map((tag) => ({ id: tag })),
          },
          isPublished: false,
          user: {
            connect: {
              id: req.user.sub,
            },
          },
        },
      })

      return responseResult(null, true, 'Article added successfully')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const editorial = await this.prisma.article.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          source: true,
          metaDescription: true,
          metaTitle: true,
          createdAt: true,
          updatedAt: true,
          thumbnail: true,
          viewersCount: true,
          category: true,
          tags: true,
        },
      })
      return responseResult(editorial, true, 'Editorial found successfully')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number) {
    return `This action updates a #${id} scrape`
  }

  async remove(data: DeleteScrapeDto) {
    const { id } = data
    try {
      await this.prisma.article.deleteMany({
        where: { id: { in: id } },
      })
      return responseResult(null, true, 'Editorial deleted successfully.')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
