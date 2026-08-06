import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { createHmac } from 'crypto';
import { getDownloadLink } from '../../../packages/core/src/services/downloadService';
import { errorHandler } from '../../../packages/core/src/middleware/errorHandler';
import { validateRateLimit } from '../../../packages/core/src/middleware/rateLimit';
import { generateWatermark } from '../../../packages/core/src/services/watermarkService';
import { DownloadLinkRequest, DownloadLinkResponse } from '../../../packages/core/src/types/download';

const secureLink = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fileId, userId } = req.body as DownloadLinkRequest;

    // Validate rate limit
    const rateLimitResult = await validateRateLimit(userId);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Generate unique token
    const token = uuidv4();

    // Create HMAC signature
    const hmac = createHmac('sha256', process.env.SECRET_KEY);
    hmac.update(token);
    const signature = hmac.digest('hex');

    // Generate download link
    const downloadLink = await getDownloadLink(fileId, userId, token, signature);

    // Generate watermark
    const watermark = await generateWatermark(userId, fileId);

    // Create response
    const response: DownloadLinkResponse = {
      downloadLink,
      watermark,
      expiresAt: new Date(Date.now() + 60 * 1000), // 1 minute expiration
    };

    return res.status(201).json(response);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default secureLink;