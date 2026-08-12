// src/lib/geo-currency.ts
import axios from 'axios';
import { Currency } from '../types/index';

interface GeoCurrencyResponse {
  country: string;
  currency: string;
  exchangeRate: number;
}

interface GeoCurrencyConfig {
  apiEndpoint: string;
  apiKey: string;
}

class GeoCurrency {
  private config: GeoCurrencyConfig;

  constructor(config: GeoCurrencyConfig) {
    this.config = config;
  }

  async getCurrency(ipAddress: string): Promise<Currency> {
    try {
      const response = await axios.get<GeoCurrencyResponse>(`${this.config.apiEndpoint}/geo/${ipAddress}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      const { country, currency, exchangeRate } = response.data;

      return {
        country,
        currency,
        exchangeRate,
      };
    } catch (error) {
      console.error('Error getting currency:', error);
      throw error;
    }
  }

  async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const response = await axios.get(`${this.config.apiEndpoint}/convert`, {
        params: {
          amount,
          from: fromCurrency,
          to: toCurrency,
        },
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      const { result } = response.data;

      return result;
    } catch (error) {
      console.error('Error converting amount:', error);
      throw error;
    }
  }
}

const geoCurrencyConfig: GeoCurrencyConfig = {
  apiEndpoint: 'https://api.geo-currency.com',
  apiKey: 'YOUR_API_KEY_HERE',
};

const geoCurrency = new GeoCurrency(geoCurrencyConfig);

export { geoCurrency };

// src/types/index.ts
interface Currency {
  country: string;
  currency: string;
  exchangeRate: number;
}

// src/app/api/geo-currency/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { geoCurrency } from '../../lib/geo-currency';

const geoCurrencyRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const ipAddress = req.ip;
    const currency = await geoCurrency.getCurrency(ipAddress);

    res.json(currency);
  } catch (error) {
    console.error('Error getting currency:', error);
    res.status(500).json({ message: 'Error getting currency' });
  }
};

export default geoCurrencyRoute;

// src/app/api/convert/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { geoCurrency } from '../../lib/geo-currency';

const convertRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.query;
    const convertedAmount = await geoCurrency.convertAmount(Number(amount), String(fromCurrency), String(toCurrency));

    res.json({ result: convertedAmount });
  } catch (error) {
    console.error('Error converting amount:', error);
    res.status(500).json({ message: 'Error converting amount' });
  }
};

export default convertRoute;

// src/components/marketplace/CheckoutModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { geoCurrency } from '../../lib/geo-currency';

interface CheckoutModalProps {
  product: any;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose }) => {
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);

  const handleCheckout = async () => {
    try {
      const ipAddress = await axios.get('https://api.ipify.org');
      const geoCurrencyResponse = await geoCurrency.getCurrency(ipAddress.data);
      const convertedAmount = await geoCurrency.convertAmount(amount, currency, geoCurrencyResponse.currency);

      // Process payment with converted amount
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Product: {product.name}</p>
      <p>Amount: {amount}</p>
      <p>Currency: {currency}</p>
      <p>Exchange Rate: {exchangeRate}</p>
      <button onClick={handleCheckout}>Checkout</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CheckoutModal;