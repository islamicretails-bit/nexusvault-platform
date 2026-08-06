import { NextFunction, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { config } from '../config';
import { logger } from '../logger';
import { EmailTemplate } from '../types/email';
import { PurchaseConfirmationEmailTemplate } from '../components/EmailTemplates/PurchaseConfirmation';
import { VendorAlertEmailTemplate } from '../components/EmailTemplates/VendorAlert';
import { SecurityLoginEmailTemplate } from '../components/EmailTemplates/SecurityLogin';

const transport = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
});

transport.use(
  'compile',
  hbs({
    viewEngine: {
      extName: '.handlebars',
      partialsDir: './src/components/EmailTemplates/',
      layoutsDir: './src/components/EmailTemplates/',
      defaultLayout: '',
    },
    viewPath: './src/components/EmailTemplates/',
    extName: '.handlebars',
  })
);

const emailService = {
  async sendPurchaseReceiptEmail(email: string, purchaseData: any) {
    try {
      const template = new PurchaseConfirmationEmailTemplate(purchaseData);
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Purchase Receipt',
        template: 'PurchaseConfirmation',
        context: template.getContext(),
      };

      await transport.sendMail(mailOptions);
      logger.info(`Purchase receipt email sent to ${email}`);
    } catch (error) {
      logger.error(`Error sending purchase receipt email: ${error}`);
    }
  },

  async sendVendorAlertEmail(email: string, alertData: any) {
    try {
      const template = new VendorAlertEmailTemplate(alertData);
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Vendor Alert',
        template: 'VendorAlert',
        context: template.getContext(),
      };

      await transport.sendMail(mailOptions);
      logger.info(`Vendor alert email sent to ${email}`);
    } catch (error) {
      logger.error(`Error sending vendor alert email: ${error}`);
    }
  },

  async sendSecurityLoginEmail(email: string, loginData: any) {
    try {
      const template = new SecurityLoginEmailTemplate(loginData);
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Security Login',
        template: 'SecurityLogin',
        context: template.getContext(),
      };

      await transport.sendMail(mailOptions);
      logger.info(`Security login email sent to ${email}`);
    } catch (error) {
      logger.error(`Error sending security login email: ${error}`);
    }
  },
};

export default emailService;