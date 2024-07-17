import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator'
import { MatchProperties } from 'src/Decorators/pipes/matchProperties.pipe'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  phone: string

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @IsStrongPassword()
  password: string

  @ApiProperty()
  @IsString()
  @MatchProperties('password', { message: 'Passwords should be matches.' })
  confirm_password?: string
}
