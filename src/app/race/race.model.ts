import { PonyModel } from 'app/pony/pony.model';

export class RaceModel {
  name: String;
  startInstant: String;
  ponies: Array<PonyModel>;
}
