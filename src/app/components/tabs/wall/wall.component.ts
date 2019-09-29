import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Office } from 'src/app/interfaces/office';
import { WallService } from 'src/app/services/wall.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})

export class WallComponent implements OnInit {

  addForm: FormGroup;
  addExpenseForm: FormGroup;
  resultStack: Array<Office> = this.wallService.resultStack;
  years: Array<string> = this.wallService.years
  offices: Array<string> = [];
  isSearchByOffice: boolean = true;
  isOptionsOpen: boolean = false;
  isAddingOpen: boolean = false;
  isAddingExpenseOpen: boolean = false;
  text: string = this.wallService.text;
  API_URL: any = this.wallService.API_URL

  constructor(
    public http: HttpClient,
    public wallService: WallService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.text = '';
    this.wallService.resultStack = [];

    this.addForm = new FormGroup({
      'office': new FormControl(null, [Validators.required]),
      'year': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.min(1000000), Validators.max(1000000000)])
    });

    this.addExpenseForm = new FormGroup({
      'office': new FormControl(null, [Validators.required]),
      'year': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.min(1000000), Validators.max(1000000000)]),
      'title': new FormControl(null, [Validators.required])
    });
    this.getAllOffices();
  }

  onEdit() {
    this.wallService.isEditMode = !this.wallService.isEditMode;
  }

  onClickedOutside() {
    this.isOptionsOpen = false;
  }

  onAddItem() {
    let newOffice = {
      'office': this.addForm.value.office,
      'amount': this.addForm.value.amount,
      'years': Number(this.addForm.value.yearsAdd),
      'timeAdded': moment().format(),
      'userAdded': this.authService.activeUser.name
    }
    this.wallService.addOffice(newOffice)
    this.addForm.reset();
    this.isAddingOpen = !this.isAddingOpen;
    // TODO:
    // angular alert popup
  }

  onAddExpenseItem() {
    let newExpense = {
      'office': this.addExpenseForm.value.office,
      'year': Number(this.addExpenseForm.value.year),
      'timeAdded': moment().format(),
      "title": this.addExpenseForm.value.title,
      'userAdded': this.authService.activeUser.name,
      'amount': this.addExpenseForm.value.amount,
    }
    this.wallService.addExpense(newExpense)
    this.addExpenseForm.reset();
    this.isAddingExpenseOpen = !this.isAddingExpenseOpen;
    // TODO:
    // angular alert popup
  }

  getAllOffices() {
    this.http.get(`${this.API_URL}/offices`)
      .subscribe(
        offices => {
          for (const key in offices) {
            if (offices.hasOwnProperty(key)) {
              const element = offices[key];
              this.offices.push(element.office)
            }
          }

        })
  }

  changeSearchKey() {
    this.isSearchByOffice = !this.isSearchByOffice;
    this.text = "";
    this.wallService.resultStack = [];
  }

  showExpenses() {
    this.wallService.isEditMode = false;
    this.wallService.isExpenseMode = !this.wallService.isExpenseMode
  }

}
