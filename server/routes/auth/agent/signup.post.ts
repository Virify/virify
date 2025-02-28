import { OwnerRole } from "@prisma/client";
// TODO: Refactor
export default defineEventHandler(async (event) => {
  const { email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber } = await readBody(event);

  // check if the agent exists
  const dbAgent = await prisma.owner.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        {
          businessName: businessName,
        },
        {
          companyRegistration: registrationNumber,
        },
      ],
    },
  });

  // adding to test
  const hashedPassword = await hashPassword("test");

  if (dbAgent) {
    return {
      status: 409,
      body: {
        error: "Agent already exists",
      },
    };
  } else {
    const agent = await prisma.owner.create({
      data: {
        email: email,
        password: hashedPassword,
        businessName: businessName,
        mainContact: mainContact,
        addressLine1: addressLine,
        city: city,
        county: county,
        country: country,
        postcode: postcode,
        companyRegistration: registrationNumber,
        role: OwnerRole.AGENT,
      },
    });

    return {
      status: 201,
      body: {
        agent: agent,
      },
    };
  }
});
