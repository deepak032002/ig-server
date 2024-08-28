import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/prisma.service'
import { ChangePasswordDto, EmailVerificationDto, LoginUserDto, VerifyEmailDto } from './dto/login-user.dto'
import { RequestWithUser } from './interface'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ConfigService } from '@nestjs/config'
import sendMail from 'src/utils/sendMail'
import { htmlContent } from 'src/utils/emailTemplate'
import { responseResult } from 'src/utils/response-result'

@Injectable()
export class UserService {
  constructor(
    private prism: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.prism.user.findFirst({
      where: { email: createUserDto.email },
    })
    if (isEmailExist) {
      throw new BadRequestException('Email already exist')
    }
    const hash = await argon2.hash(createUserDto.password)
    delete createUserDto.confirm_password
    const user = await this.prism.user.create({
      data: { ...createUserDto, password: hash },
    })
    return responseResult(user, true, 'User created successfully.')
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prism.user.findFirst({
      where: { email: loginUserDto.email },
    })

    if (!user) {
      throw new NotFoundException('Credentials are wrong.')
    }

    if (user.isDeleted) {
      throw new NotFoundException('User does not exist with this email.')
    }

    if (!user.isVerified) {
      throw new BadRequestException('Please verified your email first.')
    }

    const isMatch = await argon2.verify(user.password, loginUserDto.password)
    if (!isMatch) {
      throw new NotFoundException('Credentials are wrong.')
    }

    const payload = { sub: user.id, role: user.role }
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1d',
    })

    return responseResult(
      {
        access_token,
      },
      true,
      'User logged in successfully.',
    )
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.prism.user.findFirst({
      where: { email: verifyEmailDto.email },
    })

    if (user?.isVerified) {
      throw new BadRequestException('Email already verified')
    }

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const storedOtp = await this.cacheManager.get<string>(verifyEmailDto.email)

    if (verifyEmailDto.otp !== storedOtp) {
      throw new BadRequestException('Invalid OTP')
    }

    const promises = [
      this.cacheManager.del(verifyEmailDto.email),
      this.prism.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      }),
    ]

    await Promise.all(promises)

    return responseResult(null, true, 'Email verified successfully.')
  }

  async getEmailVerificationOtp(emailVerificationDto: EmailVerificationDto) {
    const user = await this.prism.user.findFirst({
      where: { email: emailVerificationDto.email },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`

    await this.cacheManager.set(emailVerificationDto.email, otp, 1000 * 60 * 10)

    const msgwait = await sendMail(
      emailVerificationDto.email,
      'Email Verification',
      htmlContent.replace('{{OTP_VALUE}}', otp),
    )

    if (msgwait.accepted) {
      return responseResult(null, true, 'Otp sent successfully.')
    }
  }

  async me(req: RequestWithUser) {
    const user = await this.prism.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        profilePic: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return responseResult(user, true, 'User found successfully.')
  }

  async findOne(id: string) {
    const user = await this.prism.user.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return responseResult(user, true, 'User found successfully.')
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto
  }

  async remove(id: string) {
    await this.prism.user.update({
      where: { id },
      data: { isDeleted: true },
    })

    return responseResult(null, true, 'User deleted successfully.')
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.prism.user.findUnique({
      where: { email: changePasswordDto.email },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const hash = await argon2.hash(changePasswordDto.password)

    const storedOtp = await this.cacheManager.get<string>(changePasswordDto.email)

    if (changePasswordDto.otp !== storedOtp) {
      throw new BadRequestException('Invalid OTP')
    }

    const promises = [
      this.cacheManager.del(changePasswordDto.email),
      this.prism.user.update({
        where: { id: user.id },
        data: { password: hash },
      }),
    ]

    await Promise.all(promises)

    return responseResult(null, true, 'Password changed successfully.')
  }

  async findAllUser(page: number = 1, limit: number = 10, search: string = '') {
    const users = await this.prism.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      where: {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
        AND: [{ isDeleted: false }, { role: 'AUTHOR' }],
      },
      take: limit,
    })

    const total = await this.prism.user.count({
      where: {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
        AND: [{ isDeleted: false }, { role: 'AUTHOR' }],
      },
    })

    if (users.length === 0) {
      return responseResult({ users, total }, true, 'Users not available')
    }

    return responseResult({ users, total }, true, 'Users found successfully')
  }
}
