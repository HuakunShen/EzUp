import { appWindow } from '@tauri-apps/api/window';

export function toggleWindow() {
  return appWindow.isVisible().then((visible) => {
    if (visible) {
      return appWindow.hide();
    } else {
      return appWindow.show().then(() => {
        return appWindow.setFocus();
      });
    }
  });
}
