import { Injectable } from '@nestjs/common';
import { HashingService } from '../iam/hashing/hashing.service';
import { GeneratedApiKeyInterface } from './interfaces/generated-api-key.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private readonly hashingService: HashingService) {}

  async createAndHash(id: number): Promise<GeneratedApiKeyInterface> {
    const apiKey = this.generateApiKey(id);
    const hashedKey = await this.hashingService.hash(apiKey);
    return { apiKey, hashedKey };
  }

  async validate(apiKey: string, hashedKey: string): Promise<boolean> {
    return this.hashingService.compare(apiKey, hashedKey);
  }

  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString('ascii').split(' ');
    return id;
  }

  private generateApiKey(id: number): string {
    const apiKey = `${id} ${randomUUID()}`;
    return Buffer.from(apiKey).toString('base64');
  }
}
