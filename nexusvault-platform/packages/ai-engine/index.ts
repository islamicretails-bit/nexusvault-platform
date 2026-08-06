import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import { AIProvider } from './ai-provider.interface';
import { GoogleCloudAIProvider } from './providers/google-cloud-ai.provider';
import { MicrosoftAzureAIProvider } from './providers/microsoft-azure-ai.provider';
import { AmazonWebServicesAIProvider } from './providers/amazon-web-services-ai.provider';

@Injectable()
export class AIEngine {
  private logger: Logger;
  private aiProvider: AIProvider;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(AIEngine.name);
    const aiProviderType = this.configService.get('AI_PROVIDER_TYPE');
    switch (aiProviderType) {
      case 'GOOGLE_CLOUD':
        this.aiProvider = new GoogleCloudAIProvider();
        break;
      case 'MICROSOFT_AZURE':
        this.aiProvider = new MicrosoftAzureAIProvider();
        break;
      case 'AMAZON_WEB_SERVICES':
        this.aiProvider = new AmazonWebServicesAIProvider();
        break;
      default:
        throw new Error(`Unsupported AI provider type: ${aiProviderType}`);
    }
  }

  async predict(text: string): Promise<any> {
    try {
      const model = await this.aiProvider.loadModel();
      const input = tf.tensor2d([text], [1, 1], 'string');
      const output = model.predict(input);
      return output.data();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async train(data: any[]): Promise<any> {
    try {
      const model = await this.aiProvider.loadModel();
      const inputs = tf.tensor2d(data.map((item) => item.input), [data.length, 1], 'string');
      const labels = tf.tensor2d(data.map((item) => item.label), [data.length, 1], 'string');
      await model.fit(inputs, labels, { epochs: 10 });
      return model;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}