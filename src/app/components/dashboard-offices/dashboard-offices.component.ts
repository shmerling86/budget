import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Office } from 'src/app/interfaces/office';
import { WallService } from '../../services/wall.service';

@Component({
  selector: 'dashboard-offices',
  templateUrl: './dashboard-offices.component.html',
  styleUrls: ['./dashboard-offices.component.scss']
})

export class DashboardComponent implements OnInit {
  fetchedOffices: object;
  offices: Array<Office> = [];
  amounts: Array<any> = [];
  lastTotalAmounts: Array<any> = [];
  lastTotalAmount: number = 0;
  totalAmounts: number = 0;
  dashboardYear: number = 2018;
  percentageOfGrowth: number = 0;
  selectedIndex: number = 0;

  pieChartOptions = {
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

  chartColors = this.wallService.chartColors;
  pieChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [pluginDataLabels];

  officesWithExpenses: Array<any> = [];
  officesWithExpensesFiltered: Array<any> = [];
  dataSource: object;
  totalAllAmounts: any = 0;
  others: number = 0;

  constructor(
    private http: HttpClient,
    public wallService: WallService,
    public spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getDataCurrYear();
  }

  changeYear(year?): void {
    this.selectedIndex = 0;
    this.others = 0;
    this.dashboardYear = year;
    this.getDataCurrYear();
  }

  getDataCurrYear(): void {
    this.amounts = [];
    this.offices = [];
    this.percentageOfGrowth = 0;
    this.http.get(`${this.wallService.API_URL}/offices`)
      .subscribe(res => {
        this.fetchedOffices = res;
        this.calculateData();
        this.getPercentageOfGrowth();
      }, err => { console.log(err) })
  }

  calculateData(): void {
    this.lastTotalAmounts = [];
    this.lastTotalAmount = 0
    for (let office in this.fetchedOffices) {
      if (this.fetchedOffices.hasOwnProperty(office)) {
        if (this.fetchedOffices[office].year == this.dashboardYear) {
          this.offices.push(this.fetchedOffices[office].office);
          this.amounts.push(this.fetchedOffices[office].amount);
          this.totalAmounts = this.amounts.reduce((a, b) => a + b, 0);
        }
        if (this.fetchedOffices[office].year == this.dashboardYear - 1) {
          this.lastTotalAmounts.push(this.fetchedOffices[office].amount);
          this.lastTotalAmount = this.lastTotalAmounts.reduce((a, b) => a + b, 0);
        }
      }
    }
  }

  getPercentageOfGrowth(): void {
    if (this.dashboardYear !== 2018) {
      this.percentageOfGrowth = Math.round(((this.totalAmounts - this.lastTotalAmount) / this.lastTotalAmount) * 100)
    }
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

}
