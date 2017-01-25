import {Injectable} from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { RaceModel } from './race.model';

import 'rxjs/add/operator/map';

@Injectable()
export class RaceService {
  baseUrl: String= 'http://ponyracer.ninja-squad.com';
  constructor(private http: Http) {
  }

  list(): Observable<Array<RaceModel>> {
    const urlParams = new URLSearchParams();
    urlParams.set('status', 'PENDING');
    const options = new RequestOptions({search: urlParams});
    return this.http.get(this.baseUrl + '/api/races', options).map(res => res.json());
  }
}
