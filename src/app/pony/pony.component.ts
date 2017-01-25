import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { PonyModel } from './pony.model';

@Component({
  selector: 'pr-pony',
  templateUrl: './pony.component.html',
  styleUrls: ['./pony.component.css']
})
export class PonyComponent implements OnInit {
  @Input() ponyModel: PonyModel;
  @Output() ponyClicked = new EventEmitter<PonyModel>();

  constructor() { }

  ngOnInit() {
  }

  clicked() {
    this.ponyClicked.emit(this.ponyModel);
  }

  getPonyImageUrl() {
    return 'assets/images/pony-' + this.ponyModel.color.toLowerCase() + '.gif';
  }

}
