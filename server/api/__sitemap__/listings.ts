export default defineCachedEventHandler(
  async () => {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          published: true,
          archived: false,
        },
        select: {
          id: true,
          publishedAt: true,
        },
      });

      return listings.map((listing) => ({
        loc: `/listing/${listing.id}`,
        lastmod: listing.publishedAt ?? undefined,
      }));
    } catch (error) {
      console.error("Error fetching listing URLs for sitemap:", error);
      return [];
    }
  },
  {
    maxAge: 60 * 60, // 1 hour
    name: "sitemap-listings",
  },
);
