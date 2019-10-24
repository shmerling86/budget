import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WallService } from 'src/app/services/wall.service';
import { Expense } from 'src/app/interfaces/expense';

@Component({
  selector: 'edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss']
})

export class EditExpenseComponent implements OnInit {

  editExpenseForm: FormGroup;
  editItem: Expense;
  years: Array<string> = this.wallService.years;
  listOfAllOffices: any[] = [];

  constructor(public wallService: WallService) { }

  ngOnInit() {
    this.editExpenseForm = new FormGroup({
      'office': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      'year': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.min(1000000), Validators.max(1000000000)]),
      'title': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)])
    });

    this.wallService.getAllOffices();
    this.wallService.AllOffices
      .subscribe(
        res => { this.listOfAllOffices = res }
      )

    this.editItem = this.wallService.selectedResults[0];

    this.editExpenseForm.setValue({
      office: this.editItem['office'],
      year: this.editItem['year'].toString().substring(0, 4),
      title: this.editItem['title'],
      amount: this.editItem['amount']
    })
  }

  onUpdate(office) {
    this.wallService.updateExpenses(this.editItem, office.value);
  }

}
