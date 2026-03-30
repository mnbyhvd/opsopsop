const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

// ─── Config ─────────────────────────────────────────────────────────────────
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://opsopsop-frontend';
const API_URL      = process.env.API_URL      || 'http://opsopsop-backend:3001';
const OUTPUT_DIR   = process.env.OUTPUT_DIR   || '/prerendered';
const SITE_URL     = process.env.SITE_URL     || 'https://sps-master.ru';

const STATIC_ROUTES = [
  '/',
  '/about',
  '/products',
  '/certificates',
  '/docs',
  '/videos',
  '/requisites',
  '/support',
  '/buy',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

async function fetchProductIds() {
  try {
    const result = await httpGet(`${API_URL}/api/products`);
    const products = result.data || result || [];
    const ids = products.map(p => p.id).filter(Boolean);
    console.log(`  Found ${ids.length} products: ${ids.join(', ')}`);
    return ids;
  } catch (err) {
    console.error(`  Failed to fetch products: ${err.message}`);
    return [];
  }
}

function saveHtml(route, html) {
  // route "/" → OUTPUT_DIR/index.html
  // route "/about" → OUTPUT_DIR/about/index.html
  const dir = route === '/'
    ? OUTPUT_DIR
    : path.join(OUTPUT_DIR, route);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'index.html');
  fs.writeFileSync(filePath, html, 'utf-8');
  return filePath;
}

function generateSitemap(allRoutes) {
  const urls = allRoutes.map(route => {
    const isHome = route === '/';
    const isProduct = route.startsWith('/product/');
    const priority = isHome ? '1.0' : isProduct ? '0.7' : '0.8';
    const changefreq = isProduct ? 'weekly' : 'monthly';
    return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== SPS Master Prerender ===');
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log(`API:      ${API_URL}`);
  console.log(`Output:   ${OUTPUT_DIR}`);
  console.log('');

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Fetch dynamic product routes
  console.log('Fetching product IDs from API...');
  const productIds = await fetchProductIds();
  const productRoutes = productIds.map(id => `/product/${id}`);
  const allRoutes = [...STATIC_ROUTES, ...productRoutes];

  console.log(`\nTotal routes to render: ${allRoutes.length}`);

  // Launch browser
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote',
    ],
    headless: true,
  });

  let successCount = 0;
  let failCount = 0;

  for (const route of allRoutes) {
    const url = `${FRONTEND_URL}${route}`;
    process.stdout.write(`Rendering ${route} ... `);

    let page;
    try {
      page = await browser.newPage();

      // Block images, fonts, media to speed up rendering
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const type = req.resourceType();
        if (type === 'image' || type === 'media' || type === 'font') {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Extra wait to ensure React finishes rendering
      // (accounts for 500ms LoadingScreen + API calls)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const html = await page.content();
      const savedPath = saveHtml(route, html);
      console.log(`OK → ${savedPath}`);
      successCount++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failCount++;
    } finally {
      if (page && !page.isClosed()) {
        await page.close();
      }
    }
  }

  await browser.close();

  // Generate and save sitemap
  console.log('\nGenerating sitemap.xml...');
  const sitemap = generateSitemap(allRoutes);
  const sitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
  console.log(`Sitemap saved: ${sitemapPath}`);

  console.log(`\n=== Done ===`);
  console.log(`Success: ${successCount}/${allRoutes.length}`);
  if (failCount > 0) {
    console.log(`Failed:  ${failCount}/${allRoutes.length}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
