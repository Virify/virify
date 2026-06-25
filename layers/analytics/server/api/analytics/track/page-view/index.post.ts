/**
 * POST /api/analytics/track/page-view
 *
 * Track first-party site page views for internal analytics.
 * Uses sendBeacon, so failures should never affect navigation.
 */
import * as z from "zod";
import { detectPageViewSource, getClientIp } from "~~/layers/analytics/server/utils/page-view";

const pageViewSchema = z.object({
  sessionId: z.string().nullable().optional(),
  timestamp: z.number(),
  path: z.string().min(1).max(500),
  fullPath: z.string().min(1).max(1000),
  title: z.string().max(250).optional(),
  routeName: z.string().max(250).optional(),
  referrer: z.string().max(1000).optional(),
  userAgent: z.string().max(1000).optional(),
  source: z.enum(["search", "direct", "social", "email", "referral"]).optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, pageViewSchema.parse);
    const { user } = await getUserSession(event);
    const source = body.source || detectPageViewSource(body.referrer);

    await prisma.pageView.create({
      data: {
        userId: user?.id || null,
        sessionId: body.sessionId,
        path: body.path,
        fullPath: body.fullPath,
        title: body.title,
        routeName: body.routeName,
        referrer: body.referrer,
        source,
        userAgent: body.userAgent,
        ip: getClientIp(event),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error tracking page view:", error);
    return { success: false };
  }
});
