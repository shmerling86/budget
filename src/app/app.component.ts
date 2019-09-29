import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'galaxy';
  constructor(private loader: NgxSpinnerService) {}

  ngOnInit() {
    // this.loader.show();
    // setTimeout(() => {
    //   this.loader.hide();
    // }, 500);
    
  }
}