import { Component, OnInit } from '@angular/core';
import { WallService } from '../../services/wall.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})

export class TabsComponent implements OnInit {

  isWall: boolean = false;

  constructor(
    public wallService: WallService,
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

}
