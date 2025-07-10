export default function useAi() {
  const { trackAiSearch } = useAnalytics();
  // Global state for query analysis and search query
  const queryAnalysis = useState<QueryAnalysis | null>(
    "ai-query-analysis",
    () => null
  );
  const searchQuery = useState<string>("ai-search-query", () => "");

  /**
   * Perform an AI search with the given location and radius
   * @param location The location to search
   * @param radius The search radius
   * @param query The search query
   * @returns The search results
   */
  async function aiSearch(location: GeocodingFeature, radius: number, query: string) {
    searchQuery.value = query; // Update state for analysis function
    const response = await $fetch<AiSearchResponse>("/api/search/rag/", {
      method: "POST",
      body: {
        query: query,
        lat: location.geometry.coordinates[1],
        lon: location.geometry.coordinates[0],
        radius: radius,
      },
    });

    trackAiSearch(query, location);

    if (response.queryAnalysis) {
      queryAnalysis.value = response.queryAnalysis;
    }

    return response;
  }

  /**
   * Generate a structured array of query segments for highlighting.
   * @returns An array of objects with text and type ('used', 'ignored', 'normal').
   */
  function getAnalyzedQuerySegments() {
    if (!searchQuery.value) return [];
    if (!queryAnalysis.value) {
      return [{ text: searchQuery.value, type: "normal" }];
    }

    const { usedTerms, ignoredTerms } = queryAnalysis.value;
    const allTerms = [...usedTerms, ...ignoredTerms].sort((a, b) => b.length - a.length);

    const segments: { text: string; type: "used" | "ignored" | "normal" }[] = [];
    let lastIndex = 0;

    const termMap = new Map<string, "used" | "ignored">();
    usedTerms.forEach(term => termMap.set(term.toLowerCase(), "used"));
    ignoredTerms.forEach(term => termMap.set(term.toLowerCase(), "ignored"));

    const regex = new RegExp(allTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "gi");

    searchQuery.value.replace(regex, (match, offset) => {
      // Add the text before the current match as a normal segment
      if (offset > lastIndex) {
        segments.push({ text: searchQuery.value.substring(lastIndex, offset), type: "normal" });
      }

      // Add the matched term with its type
      const type = termMap.get(match.toLowerCase());
      if (type) {
        segments.push({ text: match, type });
      }

      lastIndex = offset + match.length;
      return match; // Required by replace function
    });

    // Add any remaining text after the last match
    if (lastIndex < searchQuery.value.length) {
      segments.push({ text: searchQuery.value.substring(lastIndex), type: "normal" });
    }

    return segments;
  }

  return {
    aiSearch,
    getAnalyzedQuery: getAnalyzedQuerySegments, // Rename for compatibility
    queryAnalysis,
    searchQuery,
  };
}
