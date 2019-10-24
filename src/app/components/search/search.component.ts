import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public wallService: WallService,
    public router: Router) { }

  isAddingOpen: boolean = false;
  isSearchKeyOptionsOpen: boolean = false;
  isAddOptionsOpen: boolean = false;
  text: string = this.wallService.text;

  ngOnInit() {
  }

  onClickSetting() {
    this.wallService.resultStack = [];
    this.wallService.text = '';
    this.isSearchKeyOptionsOpen = !this.isSearchKeyOptionsOpen;
  }

  onClickedOutside() {
    this.isSearchKeyOptionsOpen = false;
  }

  changeSearchKey(searchKey) {
    this.text = "";
    this.wallService.resultStack = [];
    this.wallService.searchKey = searchKey;
  }
}
