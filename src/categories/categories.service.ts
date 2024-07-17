import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { responseResult } from 'src/utils/response-result'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.findFirst({
        where: {
          name: createCategoryDto.name.toLowerCase(),
        },
      })

      if (category) {
        throw new BadRequestException('Category already exist')
      }

      const createCategory = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name.toLowerCase(),
        },
      })

      if (!createCategory) {
        throw new BadRequestException('Something went wrong')
      }

      return responseResult(createCategory, true, 'Category created successfully.')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({
        where: {
          isDeleted: false,
        },
      })

      if (!categories) {
        throw new BadRequestException('Something went wrong')
      }

      if (!categories.length) {
        throw new NotFoundException('No categories found')
      }

      return responseResult(categories, true, 'Categories found successfully')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id, isDeleted: false },
      })

      if (!category) {
        throw new NotFoundException('Category not found')
      }

      return responseResult(category, true, 'Category found successfully')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name.toLowerCase(),
        },
      })

      if (!category) {
        throw new BadRequestException('Something went wrong')
      }

      return responseResult(category, true, 'Category updated successfully.')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id, isDeleted: false },
      })

      if (!category) {
        throw new BadRequestException('Category not found!')
      }

      const categoryUpdate = await this.prisma.category.update({
        where: { id },
        data: { isDeleted: true },
      })

      return responseResult(categoryUpdate, true, 'Category deleted successfully')
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
