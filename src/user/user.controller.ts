import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  Query,
  ParseIntPipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateAdminUserDto, CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ChangePasswordDto, EmailVerificationDto, LoginUserDto, VerifyEmailDto } from './dto/login-user.dto'
import { AuthGuard } from 'src/Decorators/guards/auth.guard'
import { RequestWithUser } from './interface'
import { Roles, RolesGuard } from 'src/Decorators/guards/roles.guard'
import { Role } from 'src/types'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto)
  }

  @Post('/verify-email')
  @HttpCode(200)
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.userService.verifyEmail(verifyEmailDto)
  }

  @Post('/get-email-verification-otp')
  @HttpCode(200)
  getEmailVerificationOtp(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.userService.getEmailVerificationOtp(emailVerificationDto)
  }

  @Post('/forget-password')
  @HttpCode(200)
  forgetPassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(changePasswordDto)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/me')
  me(@Req() req: RequestWithUser) {
    return this.userService.me(req)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @ApiQuery({ name: 'search', required: false })
  @ApiBearerAuth()
  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/list')
  findAllUser(
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
    return this.userService.findAllUser(page, limit, search)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }

  @ApiBearerAuth()
  @Roles([Role.SUPER_ADMIN, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/admin-user-create')
  addUserByAdminController(@Body() createAdminUserDto: CreateAdminUserDto) {
    return this.userService.addUserByAdmin(createAdminUserDto)
  }
}
