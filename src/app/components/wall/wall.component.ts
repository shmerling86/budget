import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { WallService } from 'src/app/services/wall.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  animations: [
    trigger('selected', [
      state('true', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(1000)
      ])
    ]),
    trigger('selected', [
      state('true', style({ opacity: 0 })),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(1000)
      ])
    ])
  ]
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
    this.wallService.isFinishUpdate = false;
    this.wallService.isFinishUpdateExpense = false;
    this.wallService.allDoughnutAmounts.subscribe(
      res => { this.wallService.doughnutChartData = res }
    )

  }

  onEdit(type) {
    type === 'office' ? this.wallService.isEditMode = !this.wallService.isEditMode :
      this.wallService.isEditExpenseMode = !this.wallService.isEditExpenseMode;
  }

}
