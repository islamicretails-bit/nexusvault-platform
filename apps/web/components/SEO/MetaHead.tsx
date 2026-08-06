import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { getProduct } from '../../store/selectors/product';
import { getCanonicalUrl } from '../../utils/url';

interface MetaHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  product?: any;
}

const MetaHead: React.FC<MetaHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  product,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const store = useStore();
  const canonicalUrl = getCanonicalUrl(location.pathname);

  const productData = product || getProduct(store);
  const productName = productData ? productData.name : '';
  const productDescription = productData ? productData.description : '';
  const productImage = productData ? productData.image : '';

  const metaTitle = title || productName;
  const metaDescription = description || productDescription;
  const metaKeywords = keywords || 'nexusvault, marketplace, digital goods';
  const metaImage = image || productImage;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="NexusVault" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: metaTitle,
            description: metaDescription,
            image: metaImage,
            url: canonicalUrl,
          }),
        }}
      />
      {productData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: productName,
              description: productDescription,
              image: productImage,
              url: canonicalUrl,
            }),
          }}
        />
      )}
    </Helmet>
  );
};

export default MetaHead;