import sendAgentVerification from "~~/server/utils/email/send-agent-verification";

export default defineEventHandler(async (event) => {
  const { email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber } = await readBody(event);
  const { successResponse } = useResponse();

  // validate the request body
  const formData = {
    email,
    businessName,
    mainContact,
    addressLine,
    city,
    county,
    country,
    postcode,
    registrationNumber,
  }

  try {
  // check if the agent exists
  const dbAgent = await findBusinessOwner(email, businessName, registrationNumber);

  const testAgent = await prisma.owner.findFirst({
    where: {
      OR: [
        { email },
        { businessName },
        { companyRegistration: registrationNumber },
      ],
    },
    include: {
      verification: true, // Include the verification relation
    },
  });
  // if the agent exists, return an error
  if(testAgent) {
    if(testAgent.verification) {
      throw createError({ statusCode: 403, statusMessage: "Agent already approved!" });
    }
  }

  if(dbAgent) {
    if(dbAgent.verification) {
      throw createError({ statusCode: 403, statusMessage: "Agent already approved by another user!" });
    }
  }

  // create the agent
  await createBusinessOwner(email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber);

  // send the review email
  await sendAgentVerification(formData);


  return successResponse("Agent created successfully");
  } catch (err) {
    return err;
  }
});
