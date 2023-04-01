import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Service, Toast, ServiceType, ShortcutsMap } from './types';
import { ServiceSchema, ServicesSchema, ShortcutsSchema } from './types';
import { Store } from 'tauri-plugin-store-api';
import {
  KeyServices,
  KeyCurSerivce,
  KeySelectedServiceId,
  KeyShortcuts,
  KeyFormatter,
} from './constants';
import { z, type Writeable } from 'zod';
import { defaultShortcutsMap, type FormatType, FormatEnum } from '$lib/util';

// these stores are tauri stores, not svelte stores
export const settingStore = new Store('settings.json');
export const dataStore = new Store('data.json');

// define writable stores
export const services: Writable<Service[]> = writable([]);
export const toasts: Writable<Toast[]> = writable([]);
export const logImagesUrls: Writable<string[]> = writable([]);
export const uploading: Writable<boolean> = writable(false);
export const formatter: Writable<FormatType> = writable('plainlink');
// export const formatter: Writable<FormatType> = writable(FormatEnum.enum.plainLink);
export const selectedServiceId: Writable<string | undefined> =
  writable(undefined);
export const shortcutsMap: Writable<ShortcutsMap> = writable();
export const serviceMap = derived(services, ($services) => {
  const _map = new Map<string, Service>();
  for (const service of $services) {
    _map.set(service.id, service);
  }
  return _map;
});
export const curService = derived(
  [selectedServiceId, serviceMap],
  ([$selectedServiceId, $serviceMap]) => {
    return !!$selectedServiceId
      ? $serviceMap.get($selectedServiceId)
      : undefined;
  }
);

export async function init() {
  await settingStore.set('last-access-time', Date.now());
  await dataStore.set('last-access-time', Date.now());
  const rawKeyShortcuts = await settingStore.get<ShortcutsMap>(KeyShortcuts);
  const loadedShortcutsMap = rawKeyShortcuts
    ? ShortcutsSchema.parse(rawKeyShortcuts)
    : defaultShortcutsMap();
  shortcutsMap.set(loadedShortcutsMap);
  shortcutsMap.subscribe(async (value) => {
    await settingStore.set(KeyShortcuts, value);
    await settingStore.save();
  });
  const rawServices = await settingStore.get<Service[]>(KeyServices);
  const rawSelectedServiceId = await settingStore.get<string>(
    KeySelectedServiceId
  );
  const loadedServices = !!rawServices
    ? ServicesSchema.parse(rawServices)
    : ([] as Service[]);
  services.set(loadedServices);
  services.subscribe(async (value) => {
    // console.log(value);
    // localStorage.setItem(KeyServices, JSON.stringify(value));
    await settingStore.set(KeyServices, value);
    await settingStore.save();
  });

  const loadedServiceId = rawSelectedServiceId
    ? z.string().parse(rawSelectedServiceId)
    : undefined;
  selectedServiceId?.set(loadedServiceId);
  selectedServiceId.subscribe(async (value) => {
    // console.log(value);
    // localStorage.setItem(KeySelectedServiceId, JSON.stringify(value));
    await settingStore.set(KeySelectedServiceId, value || null);
    await settingStore.save();
  });

  // formatter init
  const rawFormatter = await settingStore.get<FormatType>(KeyFormatter);
  // console.log(rawFormatter);
  let format: FormatType = FormatEnum.enum.plainlink;
  try {
    format = FormatEnum.parse(rawFormatter);
  } catch (error) {
    await settingStore.set(KeyFormatter, FormatEnum.enum.plainlink);
    await settingStore.save();
  }
  formatter.set(format);
  formatter.subscribe(async (value) => {
    await settingStore.set(KeyFormatter, value);
    await settingStore.save();
  });
}

export default {
  services,
  selectedServiceId,
  curService,
  shortcutsMap,
  init,
};
