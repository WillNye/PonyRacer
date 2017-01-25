import {RacesComponent} from './races/races.component';
import {HomeComponent} from './home/home.component';

export const ROUTES = [
  {path: '', component: HomeComponent},
  {path: 'races', component: RacesComponent}
];
