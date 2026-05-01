interface SpecialKey {
  keyName?: string,
  icon?: string,
}

export function useSpecialKey(): SpecialKey {
  if (!import.meta.client) {
    return {}
  }

  const platform = useUserPlatform()

  if (platform === 'apple') {
    return {
      keyName: 'meta',
      icon: 'keys/apple'
    }
  }

  return {
    keyName: 'ctrl',
    icon: 'keys/ctrl'
  }
}