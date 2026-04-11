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
      // If AI already provided saleListing conditions, wrap them under `is`
      if (whereClause.saleListing) {
        if (!whereClause.saleListing.is) {
          whereClause.saleListing = { is: whereClause.saleListing };
        }
      } else {
        // Otherwise require that a SaleListing relation exists
        whereClause.saleListing = { isNot: null };
      }
    } else if (typeValue === "rent") {
      // If AI already provided rentalListing conditions, wrap them under `is`
      if (whereClause.rentalListing) {
        if (!whereClause.rentalListing.is) {
          whereClause.rentalListing = { is: whereClause.rentalListing };
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
 * Fetches a completion from the OpenAI API for a given search query.
 * @param query The user's natural language search query.
 * @returns The AI's response as a string.
 */
async function getAiSearchCompletion(query: string): Promise<string> {
  const schemaPrompt = await getPrismaSchemaPrompt();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: schemaPrompt },
      { role: "user", content: `Convert this search query to a complete Prisma WHERE clause: "${query}"` },
    ],
    temperature: 0,
  });

  const aiResponse = completion.choices[0]?.message?.content?.trim();
  if (!aiResponse) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate search conditions from AI.",
    });
  }
  return aiResponse;
}

/**
 * Parses the AI's JSON response string.
 * @param aiResponse The raw string response from the AI.
 * @returns The parsed JSON object.
 */
function parseAiCompletion(aiResponse: string): any {
  try {
    // Try parsing as-is first
    return JSON.parse(aiResponse);
  } catch (firstError) {
    // Fallback: Try to fix common issues (unquoted property names)
    try {
      // Replace unquoted property names like "in:" or "gte:" with quoted versions
      // This regex looks for word characters followed by : that aren't already quoted
      const sanitized = aiResponse.replace(/(?<!")(\b\w+)(?=\s*:)/g, '"$1"');
      
      return JSON.parse(sanitized);
    } catch (secondError) {
      console.error("Failed to parse AI response (original):", aiResponse);
      console.error("First parse error:", firstError);
      console.error("Second parse error (after sanitization):", secondError);
      
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid JSON response from AI: ${aiResponse.substring(0, 200)}...`,
        message: `Failed to parse AI response. The AI returned invalid JSON format. Please try again.`,
      });
    }
  }
}

/**
 * Normalizes the parsed AI response to extract the where clause and query analysis,
 * and ensures the 'published' flag is set.
 * @param parsedResponse The parsed object from the AI's response.
 * @returns A structured object containing the where clause and query analysis.
 */
function normalizeWhereClause(parsedResponse: any): aiSearchResult {
  let whereClause: any;
  let queryAnalysis = { usedTerms: [], ignoredTerms: [] };

  if (parsedResponse.whereClause && parsedResponse.queryAnalysis) {
    whereClause = parsedResponse.whereClause;
    queryAnalysis = parsedResponse.queryAnalysis;
  } else {
    whereClause = parsedResponse;
  }

  // Always ensure published is true and archived is false (match traditional search behaviour)
  if (!whereClause.published) {
    whereClause.published = true;
  }
  if (whereClause.archived === undefined) {
    whereClause.archived = false;
  }

  return { whereClause, queryAnalysis };
}

/**
 * Generate a Prisma WHERE clause from a natural language query using OpenAI.
 * Results are cached in Redis so identical queries never hit the AI API twice.
 *
 * @param query - The user's natural language search query.
 * @returns An object with a valid Prisma WHERE clause and query analysis.
 * @throws 500 error if AI is not configured or response is invalid.
 */
export async function generateWhereClauseFromQuery(query: string): Promise<aiSearchResult> {
  checkAiConfiguration();

  const storage = useStorage("cache");
  // Normalise: lowercase + collapse whitespace so trivial differences don't miss the cache
  const cacheKey = `ai-search:${query.toLowerCase().replace(/\s+/g, " ").trim()}`;

  const cached = await storage.getItem<aiSearchResult>(cacheKey);
  if (cached) {
    return cached;
  }

  const aiResponse = await getAiSearchCompletion(query);
  const parsedResponse = parseAiCompletion(aiResponse);
  const result = normalizeWhereClause(parsedResponse);

  // Store for 24 hours — same query always maps to the same WHERE clause
  await storage.setItem(cacheKey, result, { ttl: 86400 });

  return result;
}

