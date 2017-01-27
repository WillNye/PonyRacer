import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  baseUrl: String= 'http://ponyracer.ninja-squad.com';
  constructor(private http: Http) { }

  register(login, password, birthYear): Observable<any> {
    const body = {login, password, birthYear};
    return this.http.post(this.baseUrl + '/api/users', body)
      .map(res => res.json());
  }

}
