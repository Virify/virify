import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
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
  
  // Get base routes based on deployment mode
  let routes: string[]
  
  if (isWaitingListMode) {
    // In waiting list mode, only include allowed routes
    routes = [...waitingListRoutes]
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
  
  // Fetch guide categories and guides from Sanity with timeout
  try {
    // Fetch with a 5 second timeout
    const categories = await Promise.race([
      $fetch<any[]>('/api/sanity/navigation'),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Sanity fetch timeout')), 5000)
      )
    ])
    
    // Add category pages and their guides
    for (const category of categories) {
      if (category.slug?.current) {
        // Add category page
        routes.push(`/guides/${category.slug.current}`)
        
        // Add individual guide pages
        if (category.guides && Array.isArray(category.guides)) {
          for (const guide of category.guides) {
            if (guide.slug?.current) {
              routes.push(`/guides/${category.slug.current}/${guide.slug.current}`)
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching Sanity content for sitemap:', error)
    // Continue with base routes if Sanity fetch fails or times out
    // Google will still get a valid sitemap with main pages
  }
  
  // Define priority and change frequency for each route
  const getRouteConfig = (route: string): { priority: string; changefreq: string } => {
    // Exact matches
    const exactConfig: Record<string, { priority: string; changefreq: string }> = {
      '/': { priority: '1.0', changefreq: 'daily' },
      '/waiting-list': { priority: '1.0', changefreq: 'weekly' },
      '/contact': { priority: '0.8', changefreq: 'monthly' },
      '/price-paid': { priority: '0.8', changefreq: 'weekly' },
      '/guides': { priority: '0.7', changefreq: 'weekly' },
      '/terms': { priority: '0.3', changefreq: 'monthly' },
      '/privacy': { priority: '0.3', changefreq: 'monthly' },
      '/search': { priority: '0.9', changefreq: 'daily' },
    }
    
    if (exactConfig[route]) {
      return exactConfig[route]
    }
    
    // Pattern matches for dynamic routes
    if (route.startsWith('/guides/') && route.split('/').length === 3) {
      // Guide category pages: /guides/buying
      return { priority: '0.6', changefreq: 'weekly' }
    }
    
    if (route.startsWith('/guides/') && route.split('/').length === 4) {
      // Individual guide pages: /guides/buying/first-time-buyer
      return { priority: '0.5', changefreq: 'monthly' }
    }
    
    // Default
    return { priority: '0.5', changefreq: 'monthly' }
  }
  
  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
    const config = getRouteConfig(route)
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
