import { Reviewed } from "@prisma/client";

export default defineEventHandler(async (event) => {
  // get rejected agents
  const rejectedAgents = await prisma.owner.findMany({
    where: {
      verification: {
        reviewed: Reviewed.REJECTED,
      },
    }, select: {
      email: true,
      businessName: true,
      companyRegistration: true,
    }
  });

  return {
    statusCode: 200,
    body: rejectedAgents,
  }
});
