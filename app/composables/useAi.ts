export default function useAi() {
  // Global state for query analysis and search query
  const queryAnalysis = useState<{ usedTerms: string[]; ignoredTerms: string[] } | null>(
    "ai-query-analysis",
    () => null
  );
  const searchQuery = useState<string>("ai-search-query", () => "");

  /**
   * Perform an AI search with the given location and radius
   * @param location The location to search
   * @param radius The search radius
   * @returns The search results
   */
  async function aiSearch(location: GeocodingFeature, radius: { value: number, key: string }) {
    const response = await $fetch("/api/search/rag/", {
      method: "POST",
      body: {
        query: searchQuery.value,
        lat: location.geometry.coordinates[1],
        lon: location.geometry.coordinates[0],
        radius: radius.value,
      },
    });

    if (response.queryAnalysis) {
      queryAnalysis.value = response.queryAnalysis;
    }

    return response;
  }

  /**
   * Generate highlighted HTML for the analyzed query
   * @returns HTML string with highlighted terms based on query analysis
   */
  function getAnalyzedQuery() {
    const { usedTerms, ignoredTerms } = queryAnalysis.value || { usedTerms: [], ignoredTerms: [] };
    const termMap = new Map<string, "used" | "ignored">();

    if (!searchQuery.value) return "";

    if (!queryAnalysis.value) {
      return `<span style="color: #1e293b;">${searchQuery.value}</span>`;
    }

    ignoredTerms.forEach((term) => termMap.set(term.toLowerCase(), "ignored"));
    usedTerms.forEach((term) => termMap.set(term.toLowerCase(), "used"));

    // Sort by length descending to match longer terms first
    const allTerms = [...usedTerms, ...ignoredTerms].sort((a, b) => b.length - a.length);

    let highlightedQuery = searchQuery.value;

    allTerms.forEach((term) => {
      const termType = termMap.get(term.toLowerCase());
      const escapedTerm = term.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
      // Always use a global, case-insensitive regex for all terms (no word boundaries)
      const pattern = new RegExp(`${escapedTerm}`, "gi");
      const styleMap = {
        used: "color: #ea580c;",
        ignored: "text-decoration: line-through; color: #6b7280; opacity: 0.7;",
      };
      if (termType && styleMap[termType]) {
        highlightedQuery = highlightedQuery.replace(pattern, `<span style="${styleMap[termType]}">$&</span>`);
      }
    });

    // Default styling for any remaining unstyled text (not inside a span)
    highlightedQuery = highlightedQuery.replace(/(?![^<]*>)(\b[A-Za-z0-9]+\b)(?![^<]*<)/g, (match) => {
      return `<span style="color: #1e293b;">${match}</span>`;
    });

    return highlightedQuery;
  }

  return {
    aiSearch,
    getAnalyzedQuery,
    queryAnalysis,
    searchQuery,
  };
}
