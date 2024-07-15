import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { responseResult } from './utils/response-result';
@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  getHello(): string {
    return `Hello Everyone!`;
  }

  private generatePresignedUrl() {
    const timestamp = Date.now();
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, upload_preset: 'c8a5y69k' },
      this.config.get('CLOUDINARY_SECRET_KEY'),
    );

    return `https://api.cloudinary.com/v1_1/${this.config.get(
      'CLOUDINARY_CLOUD_NAME',
    )}/image/upload?api_key=${this.config.get(
      'CLOUDINARY_API_KEY',
    )}&timestamp=${timestamp}&upload_preset=c8a5y69k&signature=${signature}`;
  }

  async uploadImage() {
    try {
      const url = this.generatePresignedUrl();

      return responseResult(
        { url },
        true,
        'successfully generated presigned url',
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong');
    }
  }

  async getAllImages() {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_SECRET_KEY'),
    });
    try {
      const data = await cloudinary.search
        .expression('folder=ig')
        .max_results(30)
        .execute();

      return responseResult(data, true, 'successfully fetched images');
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong');
    }
  }
}
