<script lang="ts">
  import { register, isRegistered } from "@tauri-apps/api/globalShortcut";
  import { createDir, BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";

  import {
    isPermissionGranted,
    requestPermission,
  } from "@tauri-apps/api/notification";
  async function getNotificationPermission() {
    let permissionGranted = await isPermissionGranted();
    console.log("permissionGranted", permissionGranted);
    
    if (!permissionGranted) {
      const permission = await requestPermission();
      console.log("permission", permission);
      
      permissionGranted = permission === "granted";
      console.log("permissionGranted", permissionGranted);
    }
  }
  getNotificationPermission()
  // isPermissionGranted()
  //   .then((isGranted?: boolean) => {
  //     if (!isGranted) {
  //       return requestPermission();
  //     } else {
  //       return Promise.resolve();
  //     }
  //   })
  //   .then((granted) => {
  //     console.log("granted", granted);
  //   });

  // Create the `$APPDATA/users` directory
  // console.log(BaseDirectory.AppData);
  // writeTextFile('ezup.conf', 'file contents', { dir: BaseDirectory.Desktop });
  // await createDir('users', { dir: BaseDirectory.AppData, recursive: true });
  // register("CommandOrControl+Shift+C", () => {
  //   console.log("Shortcut triggered");
  // }).then(() => {
  //   console.log("registered");
  // });
  // isRegistered("CommandOrControl+C").then((reg) => {
  //   console.log(reg);
  // });
  // (async () => {
  //   const isRegistered = await isRegistered("CommandOrControl+P");
  //   console.log(isRegistered);
  // })();
</script>

<div class="text-left w-full">
  <h1>Preference Page</h1>
</div>
