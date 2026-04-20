import { IMetadata } from "../interface/IMetadata";

export type ResponseType<T> =  {
  results: number;
  metadata: IMetadata;
  data: T[];
 }