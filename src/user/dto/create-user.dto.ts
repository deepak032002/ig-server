import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsDate,
  IsStrongPassword,
  ValidateNested,
  IsObject,
} from 'class-validator'
import { Type } from 'class-transformer'
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
  confirmPassword?: string
}

export class AddressDto {
  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'City must be at least 3 characters' })
  @IsOptional()
  city: string

  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'State must be at least 3 characters' })
  @IsOptional()
  state: string

  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'Country must be at least 3 characters' })
  @IsOptional()
  country: string

  @ApiProperty()
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'Pincode must be exactly 6 digits' })
  @IsOptional()
  pincode: string
}

export class CreateAdminUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @ApiProperty()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  @IsOptional()
  phone: string

  @ApiProperty()
  @IsDate({ message: 'Invalid date format' })
  @Type(() => Date)
  @IsOptional()
  dob: Date

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  profilePic: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  role: string

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string

  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password is not strong enough',
  })
  confirmPassword: string

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsObject()
  @IsOptional()
  address: AddressDto
}
