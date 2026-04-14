import OpenAI from "openai";

const config = useRuntimeConfig();

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY as string,
});

/**
 * Checks if the required AI configuration is present.
 */
export function checkAiConfiguration() {
  if (!process.env.OPENAI_API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: "AI search is not configured. Please contact support.",
    });
  }
}

// ---------------------------------------------------------------------------
// extractSearchParameters — calls OpenAI with function calling.
// GPT fills flat SearchParameters; never sees Prisma operators.
// ---------------------------------------------------------------------------
/** Calls OpenAI with function calling to extract flat `SearchParameters` from a natural language query. */
async function extractSearchParameters(query: string): Promise<SearchParameters> {
  const today = new Date().toISOString().split('T')[0];
  const systemWithDate = `Today's date is ${today}. Use this when computing relative dates (e.g. "next month", "in 3 months").\n\n${SYSTEM_PROMPT}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemWithDate },
      { role: "user", content: query },
    ],
    tools: [SEARCH_TOOL],
    tool_choice: { type: "function", function: { name: "set_search_parameters" } },
    temperature: 0,
  });

  const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
  const args = toolCall && "function" in toolCall ? (toolCall as any).function?.arguments : undefined;
  if (!args) {
    throw createError({ statusCode: 500, statusMessage: "AI did not return search parameters." });
  }

  try {
    return JSON.parse(args) as SearchParameters;
  } catch {
    throw createError({ statusCode: 500, statusMessage: "Failed to parse AI search parameters." });
  }
}

/**
 * Constructs the Prisma WHERE clause from the query and location filters.
 */
export async function constructPrismaWhereClause(listingType: ListingType | string | undefined, query: string, propertyIds: number[] | null) {
  const { whereClause, queryAnalysis } = await generateWhereClauseFromQuery(query);

  let typeValue: string | undefined;
  if (typeof listingType === "string") {
    typeValue = listingType;
  } else if (listingType && typeof listingType === "object" && "listingType" in listingType) {
    typeValue = (listingType as any).listingType;
  }

  // Apply listing type relation filters when provided and not 'all'
  if (typeValue && typeValue !== "all") {
    if (typeValue === "sale") {
      if (whereClause.saleListing) {
        // AI returned saleListing conditions — only wrap with `is` if they are actual field
        // conditions (e.g. { priceType: "FIXED" }). If the AI already returned a relation
        // operator like { isNot: null } or { is: { ... } }, leave it untouched: wrapping
        // { isNot: null } as { is: { isNot: null } } is invalid Prisma syntax.
        const sl = whereClause.saleListing;
        if (!sl.is && !sl.isNot) {
          whereClause.saleListing = { is: sl };
        }
      } else {
        // Otherwise require that a SaleListing relation exists
        whereClause.saleListing = { isNot: null };
      }
    } else if (typeValue === "rent") {
      if (whereClause.rentalListing) {
        const rl = whereClause.rentalListing;
        if (!rl.is && !rl.isNot) {
          whereClause.rentalListing = { is: rl };
        }
      } else {
        // Otherwise require that a RentalListing relation exists
        whereClause.rentalListing = { isNot: null };
      }
    }
  }

  if (propertyIds !== null) {
    if (propertyIds.length === 0) {
      // If no properties are in the area, we can short-circuit
      return { whereClause: { property: { is: { id: { in: [] } } } }, queryAnalysis };
    }
    
    // Ensure property exists and has the 'is' wrapper
    if (!whereClause.property) {
      whereClause.property = { is: {} };
    } else if (!whereClause.property.is) {
      // If property exists but doesn't have 'is', wrap it
      whereClause.property = { is: whereClause.property };
    }
    
    // Add the id filter inside the 'is' wrapper
    whereClause.property.is.id = { in: propertyIds };
  }

  return { whereClause, queryAnalysis };
}

/**
 * Generate a Prisma WHERE clause from a natural language query using OpenAI function calling.
 * GPT extracts flat SearchParameters; buildWhereClause() handles all nesting deterministically.
 * Results are cached for 24h. Cache key versioned — bump when SearchParameters changes.
 */
export async function generateWhereClauseFromQuery(query: string): Promise<aiSearchResult> {
  checkAiConfiguration();

  const storage = useStorage("cache");
  const cacheKey = `ai-search:${query.toLowerCase().replace(/\s+/g, " ").trim()}`;

  const cached = await storage.getItem<aiSearchResult>(cacheKey);
  if (cached) return cached;

  let result: aiSearchResult;
  try {
    const params = await extractSearchParameters(query);
    const whereClause = buildWhereClause(params);

    const queryAnalysis = {
      usedTerms: params.usedTerms ?? [],
      ignoredTerms: params.ignoredTerms ?? [],
    };

    result = { whereClause, queryAnalysis };
  } catch (error) {
    // Bust any partial/bad cache entry so the next request retries the AI call
    await storage.removeItem(cacheKey);
    throw error;
  }

  await storage.setItem(cacheKey, result, { ttl: 86400 });

  return result;
}

