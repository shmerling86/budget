import { Component, OnInit } from '@angular/core';
import { WallService } from 'src/app/services/wall.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-expenses',
  templateUrl: './dashboard-expenses.component.html',
  styleUrls: ['./dashboard-expenses.component.scss']
})
export class DashboardExpensesComponent implements OnInit {

  doughnutChartOptions = { legend: { position: 'left' } }
  doughnutChartType = 'doughnut';
  doughnutChartLabels = [];
  doughnutChartData = [];

  officeChoosen: any = 'Health';
  totalAllAmounts: number = 0;
  totalAmounts: Array<any> = [];
  currOfficeYear: any;
  officeChoosenAmount: number = 0;

  constructor(public wallService: WallService, public http: HttpClient) { }

  ngOnInit() {
    this.wallService.getAllOffices();
    this.getExpensesData();
  }

  changeOffice(office?) {
    this.officeChoosen = office;
    this.getExpensesData();
  }

  getExpensesData() {
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.totalAmounts = [];
    this.totalAllAmounts = null;
    this.http.get(`${this.wallService.API_URL}/expenses?office=${this.officeChoosen}`)
      .subscribe(
        res => {
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              const element = res[key];
              this.doughnutChartLabels.push(element.title);
              this.doughnutChartData.push(element.amount);
              this.totalAmounts.push(Number(element.amount));
              
              this.totalAllAmounts = this.totalAmounts.reduce((a, b) => { return a + b; });
            }
          }
        }
      )
    this.getTheYearOfOfficeChoosen();
  }

  getTheYearOfOfficeChoosen() {
    this.http.get(`${this.wallService.API_URL}/offices?office=${this.officeChoosen}`)
      .subscribe(
        res => {
          this.currOfficeYear = res[0].year;
          this.officeChoosenAmount = res[0].amount;
        },
        err => console.log(err)
      )
  }

}