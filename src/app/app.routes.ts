import { Routes } from '@angular/router'

import { RacesComponent } from './races/races.component';
import { BetComponent } from './bet/bet.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const ROUTES: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'races',
    children: [
      {path: '', component: RacesComponent},
      {path: ':raceId', component: BetComponent}
      ]
  },
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent}
];


