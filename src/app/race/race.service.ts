import {Injectable} from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { PonyWithPositionModel } from 'app/pony/pony.model';
import { RaceModel } from './race.model';
import { WsService } from 'app/ws.service';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';

@Injectable()
export class RaceService {
  constructor(private http: Http, private wsService: WsService) {
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
    return this.wsService.connect(`/race/${raceId}`)
      .takeWhile(race => race.status !== 'FINISHED')
      .map(race => race.ponies);
  }

  boost(raceId, ponyId) {
    return this.http.post(`${environment.baseUrl}/api/races/${raceId}/boosts`, { ponyId })
      .map(res => res.json());
  }

}
