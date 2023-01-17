import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Service, Toast, ServiceType } from './types';
import { ServiceSchema, ServicesSchema } from './types';
import { Store } from 'tauri-plugin-store-api';
import { KeyServices, KeyCurSerivce, KeySelectedServiceId } from './constants';
import { z, type Writeable } from 'zod';

// these stores are tauri stores, not svelte stores
export const settingStore = new Store('settings.json');
export const dataStore = new Store('data.json');

// define writable stores
export const services: Writable<Service[]> = writable([]);
export const toasts: Writable<Toast[]> = writable([]);
export const logImagesUrls: Writable<string[]> = writable([]);
export const selectedServiceId: Writable<string | undefined> =
  writable(undefined);
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
  const rawServices = await settingStore.get<Service[]>(KeyServices);
  const rawSelectedServiceId = await settingStore.get<string>(
    KeySelectedServiceId
  );

  const loadedServices = !!rawServices
    ? ServicesSchema.parse(rawServices)
    : ([] as Service[]);
  services.set(loadedServices);
  services.subscribe(async (value) => {
    console.log(value);

    // localStorage.setItem(KeyServices, JSON.stringify(value));
    await settingStore.set(KeyServices, value);
  });

  const loadedServiceId = rawSelectedServiceId
    ? z.string().parse(rawSelectedServiceId)
    : undefined;
  selectedServiceId?.set(loadedServiceId);
  selectedServiceId.subscribe(async (value) => {
    console.log(value);
    // localStorage.setItem(KeySelectedServiceId, JSON.stringify(value));
    await settingStore.set(KeySelectedServiceId, value || null);
  });
}

// load data
// settingStore.set(KeyServices, [])
// settingStore.get<Service[]>(KeyServices).then((_services) => {
//   console.log(_services);

//   const loadedServices = !!_services
//     ? ServicesSchema.parse(_services)
//     : ([] as Service[]);
//   services.set(loadedServices);
//   // data persistence on every change to store
//   services.subscribe((value) => {
//     console.log(value);

//     // localStorage.setItem(KeyServices, JSON.stringify(value));
//     settingStore.set(KeyServices, value);
//   });
// });
// settingStore.get<string>(KeySelectedServiceId).then((_serviceId) => {
//   console.log(_serviceId);

//   const loadedServiceId = _serviceId ? z.string().parse(_serviceId) : undefined;
//   selectedServiceId.set(loadedServiceId);
//   // data persistence on every change to store
//   selectedServiceId.subscribe((value) => {
//     console.log(value);
//     // localStorage.setItem(KeySelectedServiceId, JSON.stringify(value));
//     settingStore.set(KeySelectedServiceId, value || null);
//   });
// });

export default {
  services,
  selectedServiceId,
  curService,
  init,
};
