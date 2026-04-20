import { Metadata } from "../interface/Metadata";

export type ResponseType<T> =  {
  results: number;
  metadata: Metadata;
  data: T[];
 }