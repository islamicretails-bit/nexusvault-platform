import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { TrendScraperConfig } from '../types/index';

const prisma = new PrismaClient();

interface TrendScraperResult {
  title: string;
  description: string;
  url: string;
  keywords: string[];
}

class AiTrendScraper {
  private config: TrendScraperConfig;

  constructor(config: TrendScraperConfig) {
    this.config = config;
  }

  async scrapeTrends(): Promise<TrendScraperResult[]> {
    const results: TrendScraperResult[] = [];

    for (const url of this.config.urls) {
      try {
        const response = await axios.get(url);
        const html = response.data;

        // Extract title, description, and keywords from HTML
        const title = this.extractTitle(html);
        const description = this.extractDescription(html);
        const keywords = this.extractKeywords(html);

        results.push({
          title,
          description,
          url,
          keywords,
        });
      } catch (error) {
        console.error(`Error scraping ${url}: ${error.message}`);
      }
    }

    return results;
  }

  private extractTitle(html: string): string {
    const titleRegex = /<title>(.*?)<\/title>/;
    const match = html.match(titleRegex);

    return match && match[1] ? match[1].trim() : '';
  }

  private extractDescription(html: string): string {
    const descriptionRegex = /<meta name="description" content="(.*?)">/;
    const match = html.match(descriptionRegex);

    return match && match[1] ? match[1].trim() : '';
  }

  private extractKeywords(html: string): string[] {
    const keywordsRegex = /<meta name="keywords" content="(.*?)">/;
    const match = html.match(keywordsRegex);

    return match && match[1] ? match[1].split(',').map((keyword) => keyword.trim()) : [];
  }

  async updateProductMetadata(results: TrendScraperResult[]): Promise<void> {
    for (const result of results) {
      const product = await prisma.product.findFirst({
        where: {
          title: result.title,
        },
      });

      if (product) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            description: result.description,
            keywords: result.keywords.join(','),
          },
        });
      }
    }
  }
}

export const trendScraper = new AiTrendScraper({
  urls: [
    'https://www.example.com/trending',
    'https://www.example.com/popular',
    'https://www.example.com/new',
  ],
});

export async function scrapeTrends(): Promise<void> {
  const results = await trendScraper.scrapeTrends();
  await trendScraper.updateProductMetadata(results);
}

// Example usage:
scrapeTrends().then(() => {
  console.log('Trends scraped and product metadata updated');
}).catch((error) => {
  console.error('Error scraping trends:', error);
});