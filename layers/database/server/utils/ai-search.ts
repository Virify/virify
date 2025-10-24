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
export async function constructPrismaWhereClause(query: string, propertyIds: number[] | null) {
  const { whereClause, queryAnalysis } = await generateWhereClauseFromQuery(query);

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
    return JSON.parse(aiResponse);
  } catch (error) {
    console.error("Failed to parse AI response:", aiResponse, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Invalid JSON response from AI: ${aiResponse.substring(0, 200)}...`,
      message: `Failed to parse AI response: ${error instanceof Error ? error.message : String(error)}`,
    });
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

  // Always ensure published is true
  if (!whereClause.published) {
    whereClause.published = true;
  }

  return { whereClause, queryAnalysis };
}

/**
 * Generate a Prisma WHERE clause from a natural language query using OpenAI.
 *
 * @param query - The user's natural language search query.
 * @returns An object with a valid Prisma WHERE clause and query analysis.
 * @throws 500 error if AI is not configured or response is invalid.
 */
export async function generateWhereClauseFromQuery(query: string): Promise<aiSearchResult> {
  checkAiConfiguration();
  const aiResponse = await getAiSearchCompletion(query);
  const parsedResponse = parseAiCompletion(aiResponse);
  return normalizeWhereClause(parsedResponse);
}

