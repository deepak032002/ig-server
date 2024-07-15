import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './Decorators/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/upload-image')
  uploadImage() {
    return this.appService.uploadImage();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/get-all-image')
  getAllImages() {
    return this.appService.getAllImages();
  }
}
