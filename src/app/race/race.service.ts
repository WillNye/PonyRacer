import {Injectable} from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { RaceModel } from './race.model';

import 'rxjs/add/operator/map';

@Injectable()
export class RaceService {
  constructor(private http: Http) {
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

  get(raceId): Observable<RaceModel> {
    return this.http.get(`${environment.baseUrl}/api/races/${raceId}`)
      .map(res => res.json());
  }

  cancelBet(raceId): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/api/races/${raceId}/bets`)
  }
}
