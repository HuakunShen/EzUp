import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store'
import type { Service, ServiceTypes } from './types';

// load data from local storage
const loadedServicesRaw = localStorage.getItem("services")
const loadedServices: Service[] = !!loadedServicesRaw ? JSON.parse(loadedServicesRaw) as Service[] : [];

const loadedServiceRaw = localStorage.getItem("curService")
const loadedCurService: Service | null = !!loadedServiceRaw ? JSON.parse(loadedServiceRaw) as Service : null;


// define writable stores
export const services: Writable<Service[]> = writable(loadedServices);
export const curService: Writable<Service | null> = writable(loadedCurService);


// data persistence on every change to store
services.subscribe(value => {
    localStorage.setItem("services", JSON.stringify(value))
    // TODO: also write to file system, remove local storage later
})

curService.subscribe(value => {
    localStorage.setItem("curService", JSON.stringify(value))
    // TODO: also write to file system, remove local storage later
})

export default {
    services, curService
}