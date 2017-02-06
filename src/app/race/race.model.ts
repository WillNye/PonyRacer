import { PonyModel } from 'app/pony/pony.model';

export interface RaceModel {
  id: number;
  name: string;
  startInstant: string;
  ponies: Array<PonyModel>;
  betPonyId?: number;
  status?: 'FINISHED' | 'PENDING' | 'RUNNING';
}
