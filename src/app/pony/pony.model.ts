export class PonyModel {
  id: number;
  name: string;
  color: string;
  boosted?: boolean;
}

export interface PonyWithPositionModel extends PonyModel {
  position: number;
}
