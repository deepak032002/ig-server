import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { responseResult } from 'src/utils/response-result'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}
  async create(CreateTagDto: CreateTagDto) {
    try {
      const category = await this.prisma.tag.findFirst({
        where: {
          name: CreateTagDto.name.toLowerCase(),
        },
      })

      if (category) {
        throw new BadRequestException('Tag already exist')
      }

      const createCategory = await this.prisma.tag.create({
        data: {
          name: CreateTagDto.name.toLowerCase(),
        },
      })

      if (!createCategory) {
        throw new BadRequestException('Something went wrong')
      }

      return responseResult(createCategory, true, 'Tag created successfully.')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.tag.findMany({
        where: {
          isDeleted: false,
        },
      })

      if (!categories) {
        throw new BadRequestException('Something went wrong')
      }

      if (!categories.length) {
        throw new NotFoundException('No Tags found')
      }

      return responseResult(categories, true, 'Tags found successfully')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.tag.findUnique({
        where: { id, isDeleted: false },
      })

      if (!category) {
        throw new NotFoundException('Tag not found')
      }

      return responseResult(category, true, 'Tag found successfully')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const category = await this.prisma.tag.update({
        where: { id },
        data: {
          name: updateTagDto.name.toLowerCase(),
        },
      })

      if (!category) {
        throw new BadRequestException('Something went wrong')
      }

      return responseResult(category, true, 'Tag updated successfully.')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      const category = await this.prisma.tag.findUnique({
        where: { id, isDeleted: false },
      })

      if (!category) {
        throw new BadRequestException('Tag not found!')
      }

      const categoryUpdate = await this.prisma.tag.update({
        where: { id },
        data: { isDeleted: true },
      })

      return responseResult(categoryUpdate, true, 'Tag deleted successfully')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
