export default defineEventHandler(async (event) => {
  // create 5 locations one including Cardiff to pass to Geocode and create the address
  const locations = [
    'cardiff',
    'newport wales',
    'swansea',
    'pontypridd',
    'Tenby wales',
  ]

  for (const location of locations) {
    try {
      await $fetch('/api/location/geocode', {
        method: 'POST',
        body: {
          search: location,
        },
        headers: {
          'Accept-Language': 'en',
        },
      });
      console.log(`Location ${location} created`);
    } catch (error) {
      console.log(error);
    }
    
  }

  return {
    message: 'Locations created successfully',
  }
});