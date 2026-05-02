/**
 *  Because the search location form can exist in multiple places, but
 *  we want to be able to sync these changes, we should use `useState`
 *  to store the model value
 * 
 *  This is an external composable because we also want to be able to
 *  pre-set the text if a user loads the form from a saved state (e.g.
 *  if following a hashed link) and provides an easy external interface
 *  for setting the value programmatically
 */
export function useLocationInput() {
  const locationText = useState<string>('location-name', () => '')

  function setLocationText(newLocation: string | null) {
    if (!isString(newLocation)) {
      locationText.value = ''


      return
    }

    locationText.value = newLocation
  }

  return {
    locationText,
    setLocationText
  }
}