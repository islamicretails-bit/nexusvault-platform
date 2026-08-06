import React from 'react';
import { EmailTemplateProps } from '../../types';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getProductName } from '../../../utils/getProductName';

const PurchaseConfirmation = ({ order, user }: EmailTemplateProps) => {
  const { products, subtotal, tax, total } = order;
  const productName = getProductName(products[0].productId);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>
      <h2 style={{ color: '#333', marginBottom: '10px' }}>
        Purchase Confirmation
      </h2>
      <p style={{ marginBottom: '20px' }}>
        Dear {user.name},
      </p>
      <p style={{ marginBottom: '20px' }}>
        Thank you for your purchase of {productName}. We appreciate your business and hope you enjoy your product.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Product</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantity</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getProductName(product.productId)}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.quantity}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatCurrency(product.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginBottom: '20px' }}>
        Subtotal: {formatCurrency(subtotal)}
      </p>
      <p style={{ marginBottom: '20px' }}>
        Tax: {formatCurrency(tax)}
      </p>
      <p style={{ marginBottom: '20px' }}>
        Total: {formatCurrency(total)}
      </p>
      <p style={{ marginBottom: '20px' }}>
        If you have any questions or concerns about your order, please don't hesitate to contact us.
      </p>
      <p style={{ marginBottom: '20px' }}>
        Thank you again for your purchase.
      </p>
      <p style={{ marginBottom: '20px' }}>
        Best regards,
      </p>
      <p style={{ marginBottom: '20px' }}>
        The NexusVault Team
      </p>
    </div>
  );
};

export default PurchaseConfirmation;