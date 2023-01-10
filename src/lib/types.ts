import { z } from 'zod';
import { ServiceTypes } from './constants';

export const ImgurSettingSchema = z.object({
  clientId: z.string(),
});
export type ImgurSetting = ReturnType<typeof ImgurSettingSchema.parse>;
export const S3SettingSchema = z.object({
  region: z.string(),
  bucket: z.string(),
  accessKey: z.string(),
  secretKey: z.string(),
  domain: z.string(),
  savePath: z.string(),
});
export type S3Setting = ReturnType<typeof S3SettingSchema.parse>;

export const serviceTypes = [ServiceTypes.S3, ServiceTypes.Imgur] as const;
export const ServiceTypesEnum = z.enum(serviceTypes);
export type ServiceType = ReturnType<typeof ServiceTypesEnum.parse>;
export const NonNullServiceSchema = z.object({
  id: z.string(),
  type: ServiceTypesEnum,
  name: z.string(),
  setting: z.optional(ImgurSettingSchema.or(S3SettingSchema)),
});
export type Service = ReturnType<typeof NonNullServiceSchema.parse>;
export const ServiceSchema = z.nullable(NonNullServiceSchema);
export const ServicesSchema = z.array(NonNullServiceSchema);
