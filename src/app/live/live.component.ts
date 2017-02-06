import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs";
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/bufferToggle';
import 'rxjs/add/operator/throttleTime';

import { RaceService } from 'app/race/race.service';
import { RaceModel } from 'app/race/race.model';
import { PonyWithPositionModel } from 'app/pony/pony.model';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {
  error: boolean;
  wonBet: boolean;
  positionSubscription: Subscription;
  raceModel: RaceModel;
  poniesWithPosition: Array<PonyWithPositionModel> = [];
  winners: Array<PonyWithPositionModel>;
  clickSubject = new Subject<PonyWithPositionModel>();

  constructor(private route: ActivatedRoute, private raceService: RaceService) { }

  ngOnInit() {
    const id = this.route.snapshot.params['raceId'];
    this.raceService.get(id).subscribe(raceModel => this.raceModel = raceModel);
    this.positionSubscription = this.raceService.get(id)
      .do((race: RaceModel) => this.raceModel = race)
      .filter(race => this.raceModel.status !== 'FINISHED')
      .switchMap(race => this.raceService.live(race.id))
      .subscribe(position => {
        this.poniesWithPosition = position;
        this.raceModel.status = 'RUNNING';
      }, error => this.error = true,
        () => {
          this.raceModel.status = 'FINISHED';
          this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
          this.wonBet = this.winners.some(pony => pony.id === this.raceModel.betPonyId);
        });
    this.clickSubject.groupBy(pony => pony.id, pony => pony.id)
      .mergeMap(obs => obs.bufferToggle(obs, () => Observable.interval(1000)))
      .filter(array => array.length >= 5)
      .map(array => array[0])
      .throttleTime(1000)
      .switchMap(ponyId => this.raceService.boost(this.raceModel.id, ponyId))
      .subscribe(() => {});
  }

  ngOnDestroy() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

  onClick(pony: PonyWithPositionModel) {
    this.clickSubject.next(pony);
  }

  ponyById(index: number, pony: PonyWithPositionModel) {
    return pony.id;
  }

}
