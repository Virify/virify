/**
 * Show a toast notification.
 * 
 * @returns A function to show a toast notification.
 * @description This function uses the `useToast` composable to display a toast notification with a title and icon.
 */
export function useToastNotification() {
  const toast = useToast();

  /**
   * Show a toast notification.
   * @param notification - The notification object containing title and icon.
   */
  function showToast(notification: { title: string; icon: string }) {
    toast.add({
      title: notification.title,  
      icon: notification.icon,
    });
    toast.clear();
  }

  return { showToast };
}