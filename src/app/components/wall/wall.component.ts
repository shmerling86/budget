import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})

export class WallComponent implements OnInit {
  addForm: FormGroup;
  addExpenseForm: FormGroup;
  years: Array<string> = this.wallService.years


  text: string = this.wallService.text;
  API_URL: any = this.wallService.API_URL

  constructor(
    public wallService: WallService,
    public spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.text = '';
    this.wallService.resultStack = [];
  }

  onEdit() {
    this.wallService.isEditMode = !this.wallService.isEditMode;
  }


}
