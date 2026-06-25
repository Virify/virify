export async function getPageViewSummary() {
  const [total, authenticated, anonymous] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { userId: { not: null } } }),
    prisma.pageView.count({ where: { userId: null } }),
  ]);

  return {
    total,
    authenticated,
    anonymous,
  };
}

export async function getPageViewSources() {
  const sources = await prisma.pageView.groupBy({
    by: ["source"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  return sources.map((row) => ({
    source: row.source ?? "unknown",
    count: row._count.id,
  }));
}

export async function getTopPages(limit = 10) {
  const pages = await prisma.pageView.groupBy({
    by: ["path"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return pages.map((row) => ({
    path: row.path,
    views: row._count.id,
  }));
}
