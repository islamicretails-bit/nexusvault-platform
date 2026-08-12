// src/lib/ai-admin-command.ts
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { natural } from 'natural';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Define the schema for the admin command
const AdminCommandSchema = z.object({
  command: z.string(),
  args: z.array(z.string()),
});

// Define the natural language processing (NLP) engine
const nlp = new natural.WordTokenizer();

// Define the admin command mutator engine
class AdminCommandMutator {
  async mutate(command: string) {
    try {
      // Parse the admin command using the NLP engine
      const tokens = nlp.tokenize(command);
      const parsedCommand = AdminCommandSchema.parse({
        command: tokens[0],
        args: tokens.slice(1),
      });

      // Update the site configuration based on the parsed command
      switch (parsedCommand.command) {
        case 'change-banner':
          await this.changeBanner(parsedCommand.args);
          break;
        case 'set-theme':
          await this.setTheme(parsedCommand.args);
          break;
        case 'highlight':
          await this.highlight(parsedCommand.args);
          break;
        default:
          logger.error(`Unknown admin command: ${parsedCommand.command}`);
      }
    } catch (error) {
      logger.error(`Error parsing admin command: ${error}`);
    }
  }

  async changeBanner(args: string[]) {
    // Update the site configuration to change the banner
    const bannerText = args.join(' ');
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: { bannerText },
    });
    logger.info(`Updated banner text to: ${bannerText}`);
  }

  async setTheme(args: string[]) {
    // Update the site configuration to set the theme
    const themeName = args[0];
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: { theme: themeName },
    });
    logger.info(`Updated theme to: ${themeName}`);
  }

  async highlight(args: string[]) {
    // Update the site configuration to highlight a product category
    const category = args[0];
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: { highlightedCategory: category },
    });
    logger.info(`Updated highlighted category to: ${category}`);
  }
}

export const adminCommandMutator = new AdminCommandMutator();