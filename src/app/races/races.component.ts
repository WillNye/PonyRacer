import {Component, OnInit, EventEmitter} from '@angular/core';
import { RaceModel } from 'app/race/race.model';
import { RaceService } from 'app/race/race.service';

@Component({
  selector: 'pr-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {
  races: Array<RaceModel>;

  constructor(private raceService: RaceService) { }

  ngOnInit() {
    this.raceService.list().subscribe(races => this.races = races);
  }

}
