import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RaceModel } from 'app/race/race.model';
import { RaceService } from 'app/race/race.service';

@Component({
  selector: 'pr-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {
  raceModel: RaceModel;
  betFailed = false;

  constructor(private raceService: RaceService, private route: ActivatedRoute) { }

  ngOnInit() {
    const raceId = this.route.snapshot.params['raceId'];
    this.raceService.get(raceId)
      .subscribe(race => this.raceModel = race);
  }

  betOnPony(pony) {
    if (!this.isPonySelected(pony)) {
      this.raceService.bet(this.raceModel.id, pony.id)
        .subscribe(
          race => this.raceModel = race,
          () => this.betFailed = true
        );
    } else {
      this.raceService.cancelBet(this.raceModel.id)
        .subscribe(
          () => this.raceModel.betPonyId = null,
          () => this.betFailed = true
        );
    }
  }

  isPonySelected(pony) {
    return pony.id === this.raceModel.betPonyId;
  }

}
