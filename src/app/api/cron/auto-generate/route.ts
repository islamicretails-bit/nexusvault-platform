import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { generateProduct } from '../../../lib/ai-generator';
import { getTrendingAssets } from '../../../lib/ai-trend-scraper';
import { calculateRegionalPricing } from '../../../lib/geo-currency';
import { generateDynamicRating } from '../../../lib/security';
import { CRON_SECRET } from '../../../utils/constants';

const prisma = new PrismaClient();

const AutoGenerateRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cronSecret = req.headers['x-cron-secret'];
  if (!cronSecret || cronSecret !== CRON_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const trendingAssets = await getTrendingAssets();
    const products = await prisma.product.findMany();

    for (const asset of trendingAssets) {
      const existingProduct = products.find((product) => product.title === asset.title);
      if (!existingProduct) {
        const newProduct = await generateProduct(asset);
        const regionalPricing = calculateRegionalPricing(newProduct.price);
        const dynamicRating = generateDynamicRating();

        const productData = {
          title: newProduct.title,
          description: newProduct.description,
          price: newProduct.price,
          regionalPricing,
          rating: dynamicRating,
          categories: newProduct.categories,
        };

        const product = await prisma.product.create({
          data: productData,
        });

        console.log(`Product created: ${product.title}`);
      }
    }

    return res.status(200).json({ message: 'Auto generation completed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default AutoGenerateRoute;