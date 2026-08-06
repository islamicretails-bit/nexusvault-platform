import React from 'react';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 14,
    marginBottom: 10,
  },
  invoiceDate: {
    fontSize: 14,
    marginBottom: 20,
  },
  billingInfo: {
    marginBottom: 20,
  },
  billingInfoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  billingInfoValue: {
    fontSize: 14,
    marginBottom: 10,
  },
  items: {
    marginBottom: 20,
  },
  item: {
    borderBottom: '1px solid #ccc',
    padding: 10,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemValue: {
    fontSize: 14,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tax: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  vendorPayout: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  vendorPayoutValue: {
    fontSize: 14,
  },
});

interface InvoiceTemplateProps {
  invoice: {
    id: string;
    date: Date;
    billingInfo: {
      name: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    items: {
      id: string;
      name: string;
      quantity: number;
      price: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    vendorPayout: number;
  };
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice }) => {
  const { t } = useTranslation();

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('invoice.title')}</Text>
          <Text style={styles.invoiceNumber}>{t('invoice.number', { number: invoice.id })}</Text>
          <Text style={styles.invoiceDate}>{formatDate(invoice.date)}</Text>
        </View>
        <View style={styles.billingInfo}>
          <Text style={styles.billingInfoLabel}>{t('invoice.billingInfo.label')}</Text>
          <Text style={styles.billingInfoValue}>{invoice.billingInfo.name}</Text>
          <Text style={styles.billingInfoValue}>{invoice.billingInfo.address}</Text>
          <Text style={styles.billingInfoValue}>
            {invoice.billingInfo.city}, {invoice.billingInfo.state} {invoice.billingInfo.zip}
          </Text>
          <Text style={styles.billingInfoValue}>{invoice.billingInfo.country}</Text>
        </View>
        <View style={styles.items}>
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemLabel}>{item.name}</Text>
              <Text style={styles.itemValue}>
                {t('invoice.item.quantity', { quantity: item.quantity })} x {formatCurrency(item.price)}
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Text style={styles.subtotal}>
            {t('invoice.subtotal')} {formatCurrency(invoice.subtotal)}
          </Text>
          <Text style={styles.tax}>
            {t('invoice.tax')} {formatCurrency(invoice.tax)}
          </Text>
          <Text style={styles.total}>
            {t('invoice.total')} {formatCurrency(invoice.total)}
          </Text>
        </View>
        <View>
          <Text style={styles.vendorPayout}>
            {t('invoice.vendorPayout')} {formatCurrency(invoice.vendorPayout)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const PDFInvoice = () => {
  const invoice = {
    id: 'INV001',
    date: new Date(),
    billingInfo: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA',
    },
    items: [
      {
        id: 'ITEM001',
        name: 'Product 1',
        quantity: 2,
        price: 19.99,
      },
      {
        id: 'ITEM002',
        name: 'Product 2',
        quantity: 1,
        price: 9.99,
      },
    ],
    subtotal: 49.97,
    tax: 4.99,
    total: 54.96,
    vendorPayout: 40.00,
  };

  return (
    <PDFDownloadLink document={<InvoiceTemplate invoice={invoice} />} fileName="invoice.pdf">
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
};

export default PDFInvoice;