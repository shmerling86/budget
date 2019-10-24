import { Component, OnInit, OnDestroy } from '@angular/core';
import { WallService } from 'src/app/services/wall.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-expenses',
  templateUrl: './dashboard-expenses.component.html',
  styleUrls: ['./dashboard-expenses.component.scss']
})
export class DashboardExpensesComponent implements OnInit, OnDestroy {

  dbOffice: any;

  doughnutChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
        color: '#fff'
      }
    }
  }
  doughnutChartType = 'doughnut';
  doughnutChartLabels = [];
  doughnutChartData = [];

  totalAllAmounts: number = null;
  totalAmounts: Array<any> = [];
  listOfAllOfficesNames: any[] = [];
  listOfAllOffices: any[] = [];

  private allOfficesSub: Subscription;

  constructor(public wallService: WallService, public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.wallService.getAllOffices();
    this.allOfficesSub = this.wallService.AllOffices
      .subscribe(
        res => {
          for (const key in res) {
            this.listOfAllOffices.push(res[key]);
            this.listOfAllOfficesNames.push(res[key].office);
            this.dbOffice = res[0];
          }
          this.getExpensesData(this.dbOffice);
        }
      )
  }

  getExpensesData(dbOffice, id?) {
    (id != undefined) ? this.dbOffice = this.listOfAllOffices[id] : this.dbOffice = dbOffice;

    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.totalAmounts = [];
    this.totalAllAmounts = null;

    this.http.get(`${this.wallService.API_URL}/expenses?office=${this.dbOffice.office}&year=${this.dbOffice.year}`)
      .subscribe(
        res => {
          if (Object.entries(res).length === 0) {
            this.totalAllAmounts = 1;
          } else {
            for (let key in res) {
              this.doughnutChartLabels.push(res[key].title);
              this.doughnutChartData.push(res[key].amount);
              this.totalAmounts.push(Number(res[key].amount));
              this.totalAllAmounts = this.totalAmounts.reduce((a, b) => { return a + b; });
            }
          }
        },
        err => { console.log(err) }
      )
  }


  ngOnDestroy() {
    this.allOfficesSub.unsubscribe();
  }

}