import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateScrapeDto,
  DeleteScrapeDto,
  ScrapeOption,
} from './dto/index.dto';
import { PrismaService } from 'src/prisma.service';
import { ScrapeFunctions } from 'src/scrape/scrape.functions';
import { responseResult } from 'src/utils/response-result';

@Injectable()
export class ScrapeService {
  constructor(
    private prisma: PrismaService,
    private scrapeFunctions: ScrapeFunctions,
  ) {}

  async scrapeData(scrapeData: CreateScrapeDto) {
    try {
      const option: ScrapeOption | undefined = scrapeData.option;
      switch (option) {
        case ScrapeOption.THE_HINDU: {
          const latestHinduEditorialList =
            await this.scrapeFunctions.getListOfHinduEditorials();

          if (latestHinduEditorialList.length === 0) {
            return {
              success: true,
              message: 'Already fetched hindu editorial.',
            };
          }
          return {
            success: true,
            data: latestHinduEditorialList,
          };
        }

        case ScrapeOption.DRISHTI_IAS: {
          const list = await this.scrapeFunctions.getDrishtiIasEditorialsList();

          if (list.length === 0) {
            return {
              success: true,
              message: 'Already fetched Drishti IAS editorial.',
            };
          }
          return {
            success: true,
            message: 'Successfully fetched Drishti IAS editorial.',
            data: list,
          };
        }

        default: {
          return 'empty case';
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    // find editorial with pagination
    const editorial = await this.prisma.editorial.findMany({
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        source: {
          select: {
            id: true,
            title: true,
            link: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        thumbnail: true,
        viewersCount: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
      },
    });

    const total = await this.prisma.editorial.count({
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
      },
    });

    if (editorial.length === 0) {
      return responseResult(
        { editorial, total },
        true,
        'Editorial not available',
      );
    }

    return responseResult(
      { editorial, total },
      true,
      'Editorial found successfully',
    );
  }

  async findOne(id: string) {
    try {
      const editorial = await this.prisma.editorial.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          source: {
            select: {
              id: true,
              title: true,
              link: true,
            },
          },
          metaDescription: true,
          metaTitle: true,
          createdAt: true,
          updatedAt: true,
          thumbnail: true,
          viewersCount: true,
          category: true,
          tags: true,
        },
      });
      return responseResult(editorial, true, 'Editorial found successfully');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  update(id: number) {
    return `This action updates a #${id} scrape`;
  }

  async remove(data: DeleteScrapeDto) {
    const { id } = data;
    try {
      await this.prisma.editorial.deleteMany({
        where: { id: { in: id } },
      });
      return responseResult(null, true, 'Editorial deleted successfully.');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
