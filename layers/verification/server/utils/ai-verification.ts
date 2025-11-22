import type { Address } from "~~/layers/database/server/database/prisma/generated/client";
import { openai } from "~~/shared/utils/open-ai";
import Scribe from 'scribe.js-ocr';

const VERIFICATION_PROMPT = `You are an AI assistant verifying property ownership documents. You will receive text extracted from two documents and an expected address.

CRITICAL REQUIREMENTS:
1. Names on BOTH documents must match (same person)
2. Addresses on BOTH documents must match each other
3. Document addresses MUST match the EXPECTED ADDRESS:
   - Street name/number must match
   - Postcode must match
   - City must match

DENY if:
- Missing address or name on either document
- Names don't match between documents
- Addresses don't match between documents
- Document addresses don't match expected address

APPROVE only if:
- Names match on both documents
- Addresses match on both documents  
- Document addresses match expected address

Return ONLY valid JSON:
{
  "verificationStatus": "approved" | "denied",
  "reason": "Specific explanation of approval/denial"
}`;

const buildAddressInfo = (address: Address) => {
  const parts = [
    `Street: ${address.street}`,
    address.number && `Number: ${address.number}`,
    address.flat && `Flat: ${address.flat}`,
    `City: ${address.city}`,
    `Postcode: ${address.postcode}`,
    address.county && `County: ${address.county}`,
    address.country && `Country: ${address.country}`,
  ].filter(Boolean);

  return `===== EXPECTED ADDRESS =====\n${parts.join('\n')}\n============================`;
};

const extractTextFromDocument = async (buffer: ArrayBuffer, url: string, index: number): Promise<string> => {
  const isPdf = url.includes('.pdf') || url.includes('application/pdf');
  const fileName = `document${index + 1}.${isPdf ? 'pdf' : 'png'}`;
  const blob = new Blob([buffer], { type: isPdf ? 'application/pdf' : 'image/png' });
  const file = new File([blob], fileName, { type: blob.type });
  
  const result = await Scribe.extractText([file], ['eng'], 'txt');
  const text = typeof result === 'string' ? result : result?.text || '';
  
  if (!text) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Failed to extract text from document ${index + 1}` 
    });
  }
  
  return text;
};

/**
 * Verifies property ownership by comparing two documents against an expected address
 * @param address Expected address to verify against
 * @param fileUrls Array of signed URLs to verification documents (must be exactly 2)
 */
export async function getAiVerificationCompletion(address: Address, fileUrls: string[]) {
  if (fileUrls.length !== 2) {
    throw createError({ statusCode: 400, statusMessage: "Two files are required for verification." });
  }

  // Fetch documents
  const files = await Promise.all(
    fileUrls.map(async (url, index) => {
      const response = await fetch(url);
      return { buffer: await response.arrayBuffer(), url };
    })
  );

  // Initialize OCR engine once
  await Scribe.init({ ocr: true, pdf: true });

  // Extract text from both documents
  const extractedTexts = await Promise.all(
    files.map((file, index) => extractTextFromDocument(file.buffer, file.url, index))
  );

  // Build prompt with extracted text
  const prompt = `${VERIFICATION_PROMPT}

${buildAddressInfo(address)}

DOCUMENT 1 TEXT:
${extractedTexts[0]}

DOCUMENT 2 TEXT:
${extractedTexts[1]}`;

  // Get AI verification
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0,
  });

  return completion.choices[0]?.message?.content?.trim();
}
