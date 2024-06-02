import { Test, TestingModule } from '@nestjs/testing';
import { CustomWinstonLogger } from './custom-winston-logger';

describe('CustomWinstonLogger', () => {
  let provider: CustomWinstonLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomWinstonLogger],
    }).compile();

    provider = module.get<CustomWinstonLogger>(CustomWinstonLogger);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
