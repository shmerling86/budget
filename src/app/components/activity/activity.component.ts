import { Component, OnInit } from '@angular/core';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  isDetailsOn: boolean = false;

  constructor(public wallService: WallService) { }

  ngOnInit() {
    this.wallService.getAllTimeStamps();
  }

  toggleDetails() {
    this.isDetailsOn = !this.isDetailsOn;
  }

}