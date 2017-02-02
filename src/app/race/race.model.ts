import { PonyModel } from 'app/pony/pony.model';

export interface RaceModel {
  id: number;
  name: String;
  startInstant: String;
  ponies: Array<PonyModel>;
  betPonyId?: number;
}
