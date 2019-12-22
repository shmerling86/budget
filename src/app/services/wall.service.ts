import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from 'src/app/interfaces/expense';
import { Subject } from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})

export class WallService {

  API_URL = "https://json-server-heroku-xobunlfunp.now.sh";

  AllOffices = new Subject<any[]>();
  allDoughnutAmounts = new Subject<any[]>();

  years: Array<any> = ['2018', '2019', '2020'];
  resultStack: Array<any> = [];
  selectedResults: Array<any> = [];
  chartColors = [{ backgroundColor: ['#45aaf2', '#fc5c65', '#26de81', '#f7b731', '#a55eea', '#2d98da', '#0fb9b1'] }];

  isEditMode: boolean = false;
  isEditExpenseMode: boolean = false;
  isFinishUpdate: boolean = false;
  isFinishAdd: boolean = false;
  isFinishAddOffice: boolean = false;
  isFinishUpdateExpense: boolean = false;

  page: string = 'wall';
  searchKey: string = 'ministry';
  text: string = '';
  clickedSearchKey: any;
  dbKind: string = 'ministries';

  onlyExpenses: Array<Expense> = [];
  onlyOffices: Array<any> = [];
  onlyUsers: Array<any> = [];
  listOfAllOffices: Array<any> = [];

   doughnutChartLabels: Array<any> = [];
   doughnutChartData : Array<any> = [];
   doughnutChartType: string = 'doughnut';
   doughnutChartOptions: object = {
    legend: {
      position: 'left',
    }
  }
  activities: Array<any> = [];
  filter: string = 'all';
  db: string;

  constructor(private http: HttpClient) {
  }

  resultsBySearchText(clickedSearchKey) {
    this.clickedSearchKey = clickedSearchKey;
    this.resultStack = [];
    this.isEditMode = false;
    this.isEditExpenseMode = false;
    this.selectedResults = [];
    this.text = this.text.trim();
    let subSearch;

    if (this.clickedSearchKey == 'expense') {
      subSearch = 'title';
      this.dbKind = 'expenses';
    } else if (this.clickedSearchKey == 'ministry') {
      subSearch = 'office';
      this.dbKind = 'offices';
    } else {
      subSearch = 'year';
      this.dbKind = 'offices';
    }

    this.http.get(`${this.API_URL}/${this.dbKind}?${subSearch}_like=${this.text}`)
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
    this.http.post(`${this.API_URL}/offices`, newOffice)
      .subscribe(
        res => { },
        err => { console.log(err) }
      )
    this.isFinishAddOffice = true;
    setTimeout(() => {
      this.isFinishAddOffice = false;
    }, 2500);
  }

  addExpense(newExpense) {
    this.getRandColor();
    this.http.post(`${this.API_URL}/expenses`, newExpense)
      .subscribe(
        res => { },
        err => { console.log(err) }
      )
    this.isFinishAdd = true;
    setTimeout(() => {
      this.isFinishAdd = false;
    }, 2500);
  }

  removeItem(id, type) {
    if (type === 'office') {
      this.isEditMode = false;
      this.db = 'Offices';
    } else {
      this.isEditExpenseMode = false;
      this.db = 'Expenses';
    }
    this.selectedResults = [];
    this.resultStack = this.resultStack.filter(res => res.id != id);

    this.http.delete(`${this.API_URL}/${this.db}/${id}`)
      .subscribe(
        res => { },
        err => { console.log(err) });
  }

  updateMinistry(oldItem, newOffice) {
    this.isEditMode = false;
    this.isFinishUpdate = false;

    this.http.patch(`${this.API_URL}/offices/${oldItem.id}`, {
      office: newOffice['office'],
      amount: newOffice['amount'],
      year: newOffice['year']
    }).subscribe(res => { }, err => { console.log(err) })

    this.http.get(`${this.API_URL}/expenses?office=${oldItem.office}`)
      .subscribe(
        res => {
          for (let key in res) {
            this.http.patch(`${this.API_URL}/expenses/${res[key].id}`, {
              office: newOffice['office'],
              year: newOffice['year']
            }).subscribe(res => {
            }, err => { console.log(err) })
          }
        }, err => { console.log(err) },
        () => {
          this.isFinishUpdate = true;
          setTimeout(() => {
            this.isFinishUpdate = false;
          }, 2500);
        }
      )
    this.selectedResults[0].office = newOffice.office;
    this.selectedResults[0].year = newOffice.year;
    this.selectedResults[0].amount = newOffice.amount;
    this.resultStack = [];
  }

  updateExpenses(oldItem, newOffice) {
    this.isEditExpenseMode = false;
    this.isFinishUpdateExpense = false;
    this.http.patch(`${this.API_URL}/expenses/${oldItem.id}`, {
      office: newOffice['office'],
      year: newOffice['year'],
      title: newOffice['title'],
      amount: newOffice['amount']
    }).subscribe(res => { }, err => { console.log(err) },
    () => {
      this.isFinishUpdateExpense = true;
        setTimeout(() => {
          this.isFinishUpdateExpense = false;
        }, 2500);
      })
      
      this.doughnutChartData[this.doughnutChartData.indexOf(oldItem.amount)] = newOffice.amount;
      this.allDoughnutAmounts.next(this.doughnutChartData.slice())
      this.doughnutChartLabels[this.doughnutChartLabels.indexOf(oldItem.title)] = newOffice.title;

      this.selectedResults[0].office = newOffice.office;
      this.selectedResults[0].title = newOffice.title;
      this.selectedResults[0].year = newOffice.year;
      this.selectedResults[0].amount = newOffice.amount;

  }

  selectedResult(matchSelected) {    
    this.getItemChartDetails(matchSelected);
    matchSelected.timeStamp = moment(matchSelected.timeStamp).startOf('minutes').fromNow();
    this.selectedResults = [];
    this.resultStack = [];
    this.text = '';
    this.selectedResults.push(matchSelected);
  }
  
  getItemChartDetails(matchSelected) {
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.http.get(`${this.API_URL}/expenses/?office=${matchSelected.office}&year=${matchSelected.year}`)
      .subscribe(
        res => {
          for (const key in res) {
            this.doughnutChartLabels.push(res[key].title);
            this.doughnutChartData.push(res[key].amount);
            this.allDoughnutAmounts.next(this.doughnutChartData.slice())

          }
        }
      )
  }

  getRandColor() {
    const colors = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
    this.chartColors[0].backgroundColor.push(colors)
  }

  clearSelected() {
    this.selectedResults = []
    this.isEditMode = false;
  }

  getAllOffices() {
    this.listOfAllOffices = [];
    this.http.get(`${this.API_URL}/offices`)
      .subscribe(
        res => {
          for (const key in res) {
            this.listOfAllOffices.push(res[key]);
          }
          this.AllOffices.next(this.listOfAllOffices.slice());
        }
      )
  }

  getAllTimeStamps() {
    this.activities = [];
    this.http.get(`${this.API_URL}/db`)
      .subscribe(
        res => {
          for (let key in res) {
            res[key].forEach(e => {
              this.activities.push(e)
            })
          }
          this.activities.sort(function (a, b) {
            return moment.utc(b.timeStamp).diff(moment.utc(a.timeStamp))
          })

          this.activities.forEach(function (element) {
            element['timeStamp'] = moment(element['timeStamp']).startOf('minutes').fromNow();
          })
        }
      )
  }

  filterAllActivities() {
    switch (this.filter) {
      case 'all':
        return this.activities;
      case 'expense':
        return this.activities.filter(activity => activity.type === 'expense');
      case 'office':
        return this.activities.filter(activity => activity.type === 'office');
      case 'user':
        return this.activities.filter(activity => activity.type === 'user');
      default:
        return this.activities;
    }
  }

}