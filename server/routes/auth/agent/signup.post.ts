export default defineEventHandler(async (event) => {
  const { email, password, agentName, mainContact, addressLine, city, county, country, postcode, registrationNumber } = await readBody(event);

  // check if the agent exists
  const dbAgent = await prisma.agent.findFirst({
    where: {
      OR: [{ email: email }, { name: agentName }, {companyRegistration: registrationNumber}],
    },
  });

  if (dbAgent) {
    return {
      status: 409,
      body: {
        error: "Agent already exists",
      },
    };
  } else {
    const hashedPassword = await hashPassword(password);
    const agent = await prisma.agent.create({
      data: {
        email: email,
        password: hashedPassword,
        name: agentName,
        contactInfo: mainContact,
        addressLine1: addressLine,
        city: city,
        county: county,
        country: country,
        postcode: postcode,
        companyRegistration: registrationNumber,
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
