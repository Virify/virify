export default defineEventHandler(async (event) => {
  // get the id from the request
  const { id } = getRouterParams(event);

  try {
    // find the user by id
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    return {
      status: 200,
      data: user,
    };  
  }
  catch (error) {
    return {
      status: 500,
      message: "Error fetching data",
      error: (error as Error).message!,
    };
  }
});