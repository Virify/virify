import * as z from "zod";

const clientErrorSchema = z.object({
  statusCode: z.number().optional(),
  statusMessage: z.string().optional(),
  message: z.string().optional(),
  stack: z.string().optional(),
  url: z.string().optional(),
  data: z.unknown().optional(),
});

/**
 * POST /api/log/client-error
 *
 * Receives error details from the client-side error.vue and logs them server-side
 * so they appear in Railway / production server logs.
 * Only logs non-4xx errors (4xx are expected client errors, not actionable).
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, clientErrorSchema.parse);

    const status = body.statusCode ?? 500;

    // 4xx errors (not found, unauthorized, etc.) are expected — skip logging
    if (status >= 400 && status < 500) return { ok: true };

    // Single-line JSON so Railway's Log Explorer can parse fields
    process.stderr.write(JSON.stringify({
      level: 'error',
      source: 'client',
      status,
      url: body.url ?? 'unknown',
      statusMessage: body.statusMessage,
      message: body.message,
      stack: body.stack,
      data: body.data,
    }) + '\n');
  } catch {
    // Silent — never let the logging endpoint itself throw
  }

  return { ok: true };
});
