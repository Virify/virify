import type { H3Event } from 'h3'

export default defineEventHandler((event: H3Event) => {
  const config = useRuntimeConfig()
  const baseUrl = 'https://virify.co.uk'
  const isWaitingListMode = config.public.DEPLOYMENT_ENV === 'waiting-list'
  
  // Allowed routes in waiting list mode
  const waitingListRoutes = [
    '/waiting-list',
    '/contact',
    '/terms',
    '/privacy',
    '/price-paid',
    '/guides',
  ]
  
  // Get routes based on deployment mode
  let routes: string[]
  
  if (isWaitingListMode) {
    // In waiting list mode, only include allowed routes
    routes = waitingListRoutes
  } else {
    // In production mode, include all public routes
    routes = [
      '/',
      '/search',
      '/waiting-list',
      '/contact',
      '/terms',
      '/privacy',
      '/price-paid',
      '/guides',
    ]
  }
  
  // Define priority and change frequency for each route
  const routeConfig: Record<string, { priority: string; changefreq: string }> = {
    '/': { priority: '1.0', changefreq: 'daily' },
    '/waiting-list': { priority: '1.0', changefreq: 'weekly' },
    '/contact': { priority: '0.8', changefreq: 'monthly' },
    '/price-paid': { priority: '0.8', changefreq: 'weekly' },
    '/guides': { priority: '0.7', changefreq: 'weekly' },
    '/terms': { priority: '0.3', changefreq: 'monthly' },
    '/privacy': { priority: '0.3', changefreq: 'monthly' },
    '/search': { priority: '0.9', changefreq: 'daily' },
  }
  
  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
    const config = routeConfig[route] || { priority: '0.5', changefreq: 'monthly' }
    const lastmod = new Date().toISOString().split('T')[0]
    
    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`
  }).join('\n')}
</urlset>`
  
  // Set proper headers
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  return sitemap
})
