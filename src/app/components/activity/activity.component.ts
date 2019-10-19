import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  constructor(public wallService: WallService, private http: HttpClient) { }

  ngOnInit() {
    this.wallService.getAllTimeStamps();
  }

  isChangeLimitAccessToggle(e) {
    if (e === true) {
      this.wallService.isExpanseDetailsOn = true;
    } else {
      this.wallService.isExpanseDetailsOn = false;

    }
  }

  

  

}