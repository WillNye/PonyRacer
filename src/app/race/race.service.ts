import {Injectable} from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { PonyWithPositionModel } from 'app/pony/pony.model';
import { RaceModel } from './race.model';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class RaceService {
  constructor(private http: Http) {
  }

  get(raceId): Observable<RaceModel> {
    return this.http.get(`${environment.baseUrl}/api/races/${raceId}`)
      .map(res => res.json());
  }

  list(): Observable<Array<RaceModel>> {
    const urlParams = new URLSearchParams();
    urlParams.set('status', 'PENDING');
    const options = new RequestOptions({search: urlParams});
    return this.http.get(`${environment.baseUrl}/api/races`, options)
      .map(res => res.json());
  }

  bet(raceId, ponyId): Observable<RaceModel> {
    return this.http.post(`${environment.baseUrl}/api/races/${raceId}/bets`, { ponyId })
      .map(res => res.json());
  }

  cancelBet(raceId): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/races/${raceId}/bets`);
  }

  live(raceId): Observable<Array<PonyWithPositionModel>> {
    return Observable
      .interval(1000)
      .take(101)
      .map( position => {
          return [
              {
              id: 1,
              name: 'Superb Runner',
              color: 'BLUE',
              position
            }, {
              id: 2,
              name: 'Awesome Fridge',
              color: 'GREEN',
              position
            }, {
              id: 3,
              name: 'Great Bottle',
              color: 'ORANGE',
              position
            }, {
              id: 4,
              name: 'Little Flower',
              color: 'YELLOW',
              position
            }, {
              id: 5,
              name: 'Nice Rock',
              color: 'PURPLE',
              position
            }
          ]
        }
      )
  }

}
