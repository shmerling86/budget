import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Office } from 'src/app/interfaces/office';



@Injectable({
  providedIn: 'root'
})

export class WallService {

  API_URL = "https://json-server-heroku-cwzbfljqrf.now.sh";
  years: Array<any> = ['2018', '2019', '2020'];
  resultStack: Array<Office> = [];
  selectedResults: Array<Office> = [];

  ChartColors = [{ backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'] }];

  isEditMode: boolean = false;
  isExpenseMode: boolean = false;
  page: string = 'dashboard';
  text: string = '';
  searchKey: string;

  constructor(private http: HttpClient) {
  }

  resultsBySearchText(year?) {
    this.resultStack = [];
    this.isEditMode = false;
    this.selectedResults = [];
    this.searchKey = 'office';

    if (year !== undefined) {
      this.searchKey = 'years';
    }

    this.text = this.text.trim();

    this.http.get(`${this.API_URL}/offices?${this.searchKey}_like=${this.text}`)
      .subscribe(
        res => {
          this.resultStack = [];
          for (const key in res) {
            this.resultStack.push(res[key])
          }
          if (
            this.text === '' ||
            this.text === null ||
            this.text === undefined) {
            this.resultStack = [];
          }
        },
        err => { console.log(err) }
      )
  }

  addOffice(newOffice) {
    this.getRandColor();
    this.http.post(this.API_URL + '/offices', newOffice)
      .subscribe(
        res => { },
        err => { console.log(err) }
      )
  }

  addExpense(newExpense){
    this.getRandColor();
    this.http.post(this.API_URL + '/expenses', newExpense)
      .subscribe(
        res => { },
        err => { console.log(err) }
      )
  }

  removeItem(id) {
    this.isEditMode = false;
    this.selectedResults = [];
    this.resultStack = this.resultStack.filter(res => res.id != id);

    this.http.delete(this.API_URL + '/offices/' + id)
      .subscribe(
        res => { },
        err => { console.log(err) });
  }

  updateItem(id, office) {
    this.isEditMode = false;
    this.selectedResults[0].office = office.office;
    this.selectedResults[0].years = office.years;
    this.selectedResults[0].amount = office.amount;
    this.resultStack = [];

    this.http.patch(this.API_URL + '/offices/' + id, {
      office: office['office'],
      amount: office['amount'],
      years: office['years']
    })
      .subscribe(
        res => { },
        err => { console.log(err) }
      )

  }

  selectedResult(matchSelected) {
    matchSelected.timeAdded = moment(matchSelected.timeAdded).startOf('minutes').fromNow();
    this.selectedResults = []
    this.resultStack = [];
    this.text = '';
    this.selectedResults.push(matchSelected);
  }

  getRandColor() {
    const colors = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
    this.ChartColors[0].backgroundColor.push(colors)
  }

  filterPages(page) {
    this.page = page;
  }

  clearSelected() {
    this.selectedResults = []
  }

}