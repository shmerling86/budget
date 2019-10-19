import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Office } from 'src/app/interfaces/office';


@Injectable({
  providedIn: 'root'
})

export class WallService {

  API_URL = "https://json-server-heroku-psjzcvonsw.now.sh";
  years: Array<any> = ['2018', '2019', '2020'];
  resultStack: Array<Office> = [];
  selectedResults: Array<Office> = [];

  chartColors = [{ backgroundColor: ['#45aaf2', '#fc5c65', '#26de81'] }];

  isEditMode: boolean = false;
  isExpenseMode: boolean = false;
  isExpanseDetailsOn: boolean = false;

  page: string = 'wall';
  searchKey: string = 'ministry';
  text: string = '';
  clickedSearchKey: any;
  dbKind: string = 'ministries';

  onlyExpenses: Array<any> = [];
  onlyOffices: Array<any> = [];
  onlyUsers: Array<any> = [];
  listOfAllOffices: Array<any> = [];

  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';
  public doughnutChartOptions = {
    legend: {
      position: 'left',
    }
  }
  activities: Array<any> = [];
  filter: string = 'all';

  constructor(private http: HttpClient) {
  }

  // getExpensesData(clickedOffice?) {
  //   this.isCalcExpense = true;
  //   this.doughnutChartLabels = [];
  //   this.doughnutChartData = [];
  //   this.officesWithExpenses = [];
  //   this.wallService.getRandColor();
  //   this.http.get(`${this.API_URL}/expenses?year=${this.dashboardYear}`)
  //     .subscribe(
  //       expenses => {
  //         if (clickedOffice == undefined) {
  //           this.getOfficeAmount(expenses[0].office);
  //         } else {
  //           this.getOfficeAmount(clickedOffice);
  //         }
  //         for (const key in expenses) {
  //           const expense = expenses[key];
  //           this.officesWithExpenses.push(expense.office)
  //           this.officesWithExpensesFiltered = [...new Set(this.officesWithExpenses)]

  //           if (clickedOffice == undefined) {
  //             if (expense.office == expenses[0].office) {
  //               this.doughnutChartLabels.push(expense.title);
  //               this.doughnutChartData.push(Number(expense.amount));
  //               this.totalAllAmounts = this.doughnutChartData.reduce((a, b) => { return a + b; });
  //             }
  //           } else {
  //             if (expense.office == clickedOffice) {
  //               this.doughnutChartLabels.push(expense.title);
  //               console.log(expense.amount);

  //               this.doughnutChartData.push(Number(expense.amount));
  //               this.totalAllAmounts = this.doughnutChartData.reduce((a, b) => { return a + b; });
  //             }
  //           }
  //         }
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     )
  // }

  // getOfficeAmount(office) {
  //   this.http.get(`${this.API_URL}/offices?office=${office}`)
  //     .subscribe(
  //       res => {
  //         this.others = Number(res[0].amount) - this.totalAllAmounts;
  //         this.doughnutChartLabels.push("Others");
  //         this.doughnutChartData.push(this.others);
  //         this.isCalcExpense = false;
  //       },
  //       err => {
  //         console.log(err)
  //       })
  // }

  resultsBySearchText(clickedSearchKey) {
    this.clickedSearchKey = clickedSearchKey;
    this.resultStack = [];
    this.isEditMode = false;
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
    // this.getRandColor();
    this.http.post(this.API_URL + '/offices', newOffice)
      .subscribe(
        res => { },
        err => { console.log(err) }
      )
  }

  addExpense(newExpense) {
    // this.getRandColor();
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
    this.selectedResults[0].year = office.year;
    this.selectedResults[0].amount = office.amount;
    this.resultStack = [];

    this.http.patch(`${this.API_URL}/offices/${id}`, {
      office: office['office'],
      amount: office['amount'],
      year: office['year']
    })
      .subscribe(
        res => { },
        err => { console.log(err) }
      )

  }

  selectedResult(matchSelected) {
    this.getItemChartDetails(matchSelected);
    matchSelected.timeStamp = moment(matchSelected.timeStamp).startOf('minutes').fromNow();
    this.selectedResults = []
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
            if (res.hasOwnProperty(key)) {
              const element = res[key];
              this.doughnutChartLabels.push(element.title);
              this.doughnutChartData.push(element.amount);
            }
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
            if (res.hasOwnProperty(key)) {
              const element = res[key];
              this.listOfAllOffices.push(element.office)
            }
          }
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