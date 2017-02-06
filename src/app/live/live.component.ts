import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RaceService } from 'app/race/race.service';
import { RaceModel } from 'app/race/race.model';
import { PonyWithPositionModel } from 'app/pony/pony.model';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {
  raceModel: RaceModel;
  poniesWithPosition: Array<PonyWithPositionModel>;
  positionSubscription: Subscription;

  constructor(private route: ActivatedRoute, private raceService: RaceService) { }

  ngOnInit() {
    const id = this.route.snapshot.params['raceId'];
    this.raceService.get(id).subscribe(raceModel => this.raceModel = raceModel);
    this.positionSubscription = this.raceService.live(id).subscribe(position => this.poniesWithPosition = position);
  }

  ngOnDestroy() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

}
