import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Router } from '@angular/router'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  baseUrl: String= 'http://ponyracer.ninja-squad.com';
  constructor(private http: Http, private router: Router) { }

  register(login, password, birthYear) {
    let postSuccess = true;
    const user = {login: login, passsword: password, birthYear: birthYear};
    this.http.post(this.baseUrl + '/api/users', user).subscribe( res => this.router.navigate(['']), err => postSuccess = false)
    return postSuccess
  }

}
