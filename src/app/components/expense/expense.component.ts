import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WallService } from 'src/app/services/wall.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  addExpenseForm: FormGroup;
  offices: Array<string> = [];


  constructor(public wallService: WallService, public authService: AuthService, public http: HttpClient) { }

  ngOnInit() {
    this.addExpenseForm = new FormGroup({
      'office': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'year': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.min(1000000), Validators.max(1000000000)]),
      'title': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    });
    this.getAllOffices()
  }

  onAddExpenseItem() {
    let newExpense = {
      'office': this.addExpenseForm.value.office,
      'year': Number(this.addExpenseForm.value.year),
      'timeStamp': moment().format(),
      "title": this.addExpenseForm.value.title,
      'userAdded': this.authService.activeUser.name,
      'amount': this.addExpenseForm.value.amount,
    }
    this.wallService.addExpense(newExpense)
    this.addExpenseForm.reset();
  }

  getAllOffices() {
    this.http.get(`${this.wallService.API_URL}/offices`)
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

}
