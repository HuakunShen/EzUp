/**
 * @author Huakun Shen
 * @email huakun.shen@huakunshen.com
 * @create date 2023-01-16 16:46:03
 * @modify date 2023-01-16 16:46:03
 * @desc this file contains notification-related helpers
 */
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/api/notification';

/**
 * @returns Whether Notification is granted
 */
export async function getNotificationPermision(): Promise<boolean> {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }
  return permissionGranted;
}

/**
 * Send notification
 * @param title Title of Notification
 * @param body Message of Notification
 */
export async function notify(title: string, body?: string): Promise<void> {
  const permissionGranted = await getNotificationPermision();
  if (permissionGranted) {
    if (!body) sendNotification(title);
    else sendNotification({ title, body });
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
}
