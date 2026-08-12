// src/lib/security.ts
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { CloudflareR2 } from '@cloudflare/r2';
import { hmac } from 'crypto';

const prisma = new PrismaClient();
const r2 = new CloudflareR2({
  account: process.env.CLOUDFLARE_ACCOUNT_ID,
  bucket: process.env.CLOUDFLARE_R2_BUCKET,
  region: process.env.CLOUDFLARE_R2_REGION,
});

// AES-256 encryption function
export function encrypt(data: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// AES-256 decryption function
export function decrypt(data: string): string {
  const parts = data.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
}

// Generate single-use presigned Cloudflare R2 download token
export async function generateDownloadToken(objectKey: string): Promise<string> {
  const token = await r2.getDownloadUrl(objectKey, {
    expires: Date.now() + 3600000, // 1 hour
  });
  return token;
}

// Validate HMAC signature
export function validateHmacSignature(data: string, signature: string): boolean {
  const hmacKey = process.env.HMAC_KEY;
  const expectedSignature = crypto.createHmac('sha256', hmacKey).update(data).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
}

// Rate limiting function
export async function rateLimit(ipAddress: string): Promise<boolean> {
  const ipRateLimit = await prisma.ipRateLimit.findFirst({
    where: {
      ipAddress,
    },
  });
  if (ipRateLimit) {
    if (ipRateLimit.count >= 10) {
      // Block IP address for 1 hour
      await prisma.ipRateLimit.update({
        where: {
          ipAddress,
        },
        data: {
          blockedUntil: new Date(Date.now() + 3600000),
        },
      });
      return false;
    } else {
      // Increment count
      await prisma.ipRateLimit.update({
        where: {
          ipAddress,
        },
        data: {
          count: ipRateLimit.count + 1,
        },
      });
      return true;
    }
  } else {
    // Create new IP rate limit entry
    await prisma.ipRateLimit.create({
      data: {
        ipAddress,
        count: 1,
      },
    });
    return true;
  }
}

// Generate hardware-locked license key fingerprint
export function generateLicenseKeyFingerprint(hardwareId: string): string {
  const fingerprint = crypto.createHash('sha256').update(hardwareId).digest('hex');
  return fingerprint;
}

// Validate license key fingerprint
export async function validateLicenseKeyFingerprint(licenseKey: string, hardwareId: string): Promise<boolean> {
  const expectedFingerprint = generateLicenseKeyFingerprint(hardwareId);
  return crypto.timingSafeEqual(Buffer.from(expectedFingerprint), Buffer.from(licenseKey));
}

// Generate JWT token
export function generateJwtToken(data: any): string {
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
}

// Validate JWT token
export function validateJwtToken(token: string): any {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}