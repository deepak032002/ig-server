import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator'

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  otp: string
}

export class EmailVerificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  otp: string
}
