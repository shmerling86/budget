import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('sub', [
      state('true', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(700)
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthService, public wallService: WallService, public router: Router) { }

  isAddMenuOpen: boolean = false;
  isSearchMenuOpen: boolean = false;
  isDashMenuOpen: boolean = false;
  isActivityMenuOpen: boolean = false;

  ngOnInit() {
  }

  onClickLogoOptions() {
    this.isAddMenuOpen = false;
    this.isSearchMenuOpen = false;
    this.isDashMenuOpen = false;
    this.isActivityMenuOpen = false;
  }

  onClickDashOptions() {
    this.isDashMenuOpen = !this.isDashMenuOpen;
    this.isAddMenuOpen = false;
    this.isSearchMenuOpen = false;
    this.isActivityMenuOpen = false;
  }

  onClickSearchOptions() {
    this.isSearchMenuOpen = !this.isSearchMenuOpen;
    this.isAddMenuOpen = false;
    this.isDashMenuOpen = false;
    this.isActivityMenuOpen = false;
  }

  onClickAddOptions() {
    this.isAddMenuOpen = !this.isAddMenuOpen;
    this.isSearchMenuOpen = false;
    this.isDashMenuOpen = false;
    this.isActivityMenuOpen = false;
  }

  onClickActivityOptions() {
    this.isActivityMenuOpen = !this.isActivityMenuOpen;
    this.isSearchMenuOpen = false;
    this.isDashMenuOpen = false;
    this.isAddMenuOpen = false;
  }


}
