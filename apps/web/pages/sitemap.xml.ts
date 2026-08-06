import { NextApiRequest, NextApiResponse } from 'next';
import { getStaticPaths } from '../../utils/getStaticPaths';
import { getLocalizedPaths } from '../../utils/getLocalizedPaths';
import { getBlogPosts } from '../../utils/getBlogPosts';
import { getProducts } from '../../utils/getProducts';

const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }: { res: NextApiResponse }) => {
  const staticPaths = await getStaticPaths();
  const localizedPaths = await getLocalizedPaths();
  const blogPosts = await getBlogPosts();
  const products = await getProducts();

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPaths.map((path) => `
        <url>
          <loc>${path}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
      `).join('')}
      ${localizedPaths.map((path) => `
        <url>
          <loc>${path}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
      `).join('')}
      ${blogPosts.map((post) => `
        <url>
          <loc>${post.url}</loc>
          <lastmod>${post.updatedAt}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
      `).join('')}
      ${products.map((product) => `
        <url>
          <loc>${product.url}</loc>
          <lastmod>${product.updatedAt}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;