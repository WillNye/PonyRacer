import { async, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import 'rxjs/add/observable/of';

import { environment } from '../environments/environment';
import { RaceService } from 'app/race/race.service';
import { RaceModel } from 'app/race/race.model';
import { PonyWithPositionModel } from 'app/pony/pony.model';

describe('RaceService', () => {

  let raceService: RaceService;
  let mockBackend: MockBackend;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      },
      RaceService
    ]
  }));

  beforeEach(() => {
    raceService = TestBed.get(RaceService);
    mockBackend = TestBed.get(MockBackend);
  });

  it('should return an Observable of 3 races', async(() => {
    // fake response
    const hardcodedRaces = [{ name: 'Paris' }, { name: 'Tokyo' }, { name: 'Lyon' }];
    const response = new Response(new ResponseOptions({ body: hardcodedRaces }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url)
        .toBe(`${environment.baseUrl}/api/races?status=PENDING`, 'The URL requested is not correct');
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(response);
    });

    raceService.list().subscribe((races: Array<RaceModel>) => {
      expect(races.length).toBe(3, 'The `list` method should return an array of RaceModel wrapped in an Observable');
    });
  }));

  it('should get a race', async(() => {
    // fake response
    const race = { name: 'Paris' };
    const response = new Response(new ResponseOptions({ body: race }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url)
        .toBe(`${environment.baseUrl}/api/races/1`, 'The URL requested is not correct');
      expect(connection.request.method).toBe(RequestMethod.Get);
      connection.mockRespond(response);
    });

    const raceId = 1;

    raceService.get(raceId).subscribe(fetchedRace => expect(fetchedRace).toBe(race));
  }));

  it('should bet on a race', async(() => {
    // fake response
    const race = { name: 'Paris' };
    const response = new Response(new ResponseOptions({ body: race }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url)
        .toBe(`${environment.baseUrl}/api/races/1/bets`, 'The URL requested is not correct');
      expect(connection.request.method).toBe(RequestMethod.Post);
      connection.mockRespond(response);
    });

    const raceId = 1;
    const ponyId = 2;

    raceService.bet(raceId, ponyId).subscribe(fetchedRace => expect(fetchedRace).toBe(race));
  }));

  it('should cancel a bet on a race', async(() => {
    // fake response
    const response = new Response(new ResponseOptions({ body: null }));
    // return the response if we have a connection to the MockBackend
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url)
        .toBe(`${environment.baseUrl}/api/races/1/bets`, 'The URL requested is not correct');
      expect(connection.request.method).toBe(RequestMethod.Delete);
      connection.mockRespond(response);
    });

    const raceId = 1;

    raceService.cancelBet(raceId).subscribe(() => {});
  }));

  it('should return live positions every seconds', fakeAsync(() => {
    const raceId = 1;
    let positions: Array<PonyWithPositionModel> = [];
    let counter = 0;

    raceService.live(raceId).subscribe(pos => {
      positions = pos;
      counter++;
    });

    expect(positions.length).toBe(0, 'The observable should only emit after 1 second');

    // emulates the 1 second delay
    tick(1000);
    expect(positions.length).toBe(5, 'The observable should have emitted after a 1 second inteval');
    let position = positions[0];
    expect(position.name).toBe('Superb Runner');
    expect(position.color).toBe('BLUE');
    expect(position.position).toBe(0);
    tick(1000);

    expect(positions.length).toBe(5);
    position = positions[1];
    expect(position.name).toBe('Awesome Fridge');
    expect(position.color).toBe('GREEN');
    expect(position.position).toBe(1);

    // emulates the 100 seconds of the race
    while (counter < 100) {
      tick(1000);
    }

    expect(positions.length).toBe(5);
    position = positions[2];
    expect(position.name).toBe('Great Bottle');
    expect(position.color).toBe('ORANGE');
    expect(position.position).toBe(99);

    tick(1000);
    expect(positions.length).toBe(5);
    position = positions[3];
    expect(position.name).toBe('Little Flower');
    expect(position.color).toBe('YELLOW');
    expect(position.position).toBe(100);

    tick(1000);
    expect(positions.length).toBe(5);
    position = positions[4];
    expect(position.name).toBe('Nice Rock');
    expect(position.color).toBe('PURPLE');
    expect(position.position).toBe(100);
  }));

});
