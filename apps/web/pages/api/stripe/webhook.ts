import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { errorHandler } from '../../../packages/core/src/middleware/errorHandler';
import { emailService } from '../../../packages/core/src/services/emailService';
import { drmEngine } from '../../../packages/core/src/security/drmEngine';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

const handleEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_intent.failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentFailed(failedPaymentIntent);
      break;
    case 'payout.paid':
      const payout = event.data.object as Stripe.Payout;
      await handlePayoutPaid(payout);
      break;
    case 'payout.failed':
      const failedPayout = event.data.object as Stripe.Payout;
      await handlePayoutFailed(failedPayout);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const handlePaymentIntentSucceeded = async (paymentIntent: Stripe.PaymentIntent) => {
  const { id, amount, currency, payment_method_types } = paymentIntent;
  const { email } = paymentIntent.metadata;
  const invoiceTemplate = await generateInvoiceTemplate(id, amount, currency, payment_method_types);
  await emailService.sendEmail({
    to: email,
    subject: 'Payment Confirmation',
    html: invoiceTemplate,
  });
};

const handlePaymentIntentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  const { id, amount, currency, payment_method_types } = paymentIntent;
  const { email } = paymentIntent.metadata;
  await emailService.sendEmail({
    to: email,
    subject: 'Payment Failed',
    text: `Payment failed for ${amount} ${currency} using ${payment_method_types}`,
  });
};

const handlePayoutPaid = async (payout: Stripe.Payout) => {
  const { id, amount, currency } = payout;
  const vendorEmail = await getVendorEmailFromPayoutId(id);
  await emailService.sendEmail({
    to: vendorEmail,
    subject: 'Payout Confirmation',
    text: `Payout of ${amount} ${currency} has been made`,
  });
};

const handlePayoutFailed = async (payout: Stripe.Payout) => {
  const { id, amount, currency } = payout;
  const vendorEmail = await getVendorEmailFromPayoutId(id);
  await emailService.sendEmail({
    to: vendorEmail,
    subject: 'Payout Failed',
    text: `Payout of ${amount} ${currency} has failed`,
  });
};

const generateInvoiceTemplate = async (id: string, amount: number, currency: string, paymentMethodTypes: string[]) => {
  const invoiceTemplate = await import('../../../apps/web/components/Billing/InvoiceTemplate').then((module) => module.InvoiceTemplate);
  return invoiceTemplate.render({
    id,
    amount,
    currency,
    paymentMethodTypes,
  });
};

const getVendorEmailFromPayoutId = async (payoutId: string) => {
  const vendor = await drmEngine.getVendorFromPayoutId(payoutId);
  return vendor.email;
};

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await handleEvent(event);
  } catch (err) {
    return res.status(500).send(`Error handling event: ${err.message}`);
  }

  res.json({ received: true });
};

const buffer = (req: NextApiRequest) => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};

export default errorHandler(handleRequest);