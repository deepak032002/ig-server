import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './Decorators/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard)
  @Get('/upload-image')
  uploadImage() {
    return this.appService.uploadImage();
  }

  @UseGuards(AuthGuard)
  @Get('/get-all-image')
  getAllImages() {
    return this.appService.getAllImages();
  }
}
