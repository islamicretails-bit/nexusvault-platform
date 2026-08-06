import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { createCheckoutSession } from '../../lib/stripe';
import { getVendorCommissionRate } from '../../lib/vendor';
import { createOrder } from '../../lib/orders';
import { sendPurchaseConfirmationEmail } from '../../lib/email';
import { errorHandler } from '../../middleware/errorHandler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const checkoutSession = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { cartItems, vendorId, customerId } = req.body;

    const session = await createCheckoutSession({
      payment_method_types: ['card'],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: {
        vendorId,
        customerId,
      },
    });

    const vendorCommissionRate = await getVendorCommissionRate(vendorId);
    const order = await createOrder({
      vendorId,
      customerId,
      cartItems,
      commissionRate: vendorCommissionRate,
    });

    await sendPurchaseConfirmationEmail({
      orderId: order.id,
      customerEmail: order.customerEmail,
      vendorName: order.vendorName,
      cartItems: order.cartItems,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default checkoutSession;

export const config = {
  api: {
    bodyParser: true,
  },
};