import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import axios from 'axios';
import { Readable } from 'stream';
import { createHmac } from 'crypto';

interface DRMOptions {
  key: string;
  expires?: number;
  watermark?: string;
}

class DRMEngine {
  private key: string;
  private algorithm: string;

  constructor(key: string) {
    this.key = key;
    this.algorithm = 'aes-256-cbc';
  }

  async generateSecureLink(assetId: string, options: DRMOptions): Promise<string> {
    const expires = options.expires || 3600; // default to 1 hour
    const watermark = options.watermark || '';
    const token = await this.generateToken(assetId, expires, watermark);
    return `https://example.com/download/${token}`;
  }

  async generateToken(assetId: string, expires: number, watermark: string): Promise<string> {
    const payload = {
      assetId,
      expires: Math.floor(Date.now() / 1000) + expires,
      watermark,
    };
    const token = await this.encrypt(JSON.stringify(payload));
    return token;
  }

  async encrypt(data: string): Promise<string> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  async decrypt(token: string): Promise<string> {
    const parts = token.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const decrypted = await this.decrypt(token);
      const payload = JSON.parse(decrypted);
      if (payload.expires < Math.floor(Date.now() / 1000)) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async watermarkAsset(assetId: string, watermark: string): Promise<string> {
    const asset = await this.getAsset(assetId);
    const watermarkedAsset = await this.applyWatermark(asset, watermark);
    return watermarkedAsset;
  }

  async getAsset(assetId: string): Promise<string> {
    const response = await axios.get(`https://example.com/assets/${assetId}`);
    return response.data;
  }

  async applyWatermark(asset: string, watermark: string): Promise<string> {
    const watermarkedAsset = asset + `\n${watermark}`;
    return watermarkedAsset;
  }

  async generateUUID(): Promise<string> {
    return uuidv4();
  }

  async generateHMAC(data: string): Promise<string> {
    const hmac = createHmac('sha256', this.key);
    hmac.update(data);
    return hmac.digest('hex');
  }
}

export default DRMEngine;