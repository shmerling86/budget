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
  isFirstStart: boolean = true;
  objOfAllData: any;

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
  dataSource: Object;
  totalAllAmounts: any = 0;
  others: number = 0;

  constructor(
    private http: HttpClient,
    public wallService: WallService,
    public spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.getDataCurrYear();
  }

  changeYear(year?) {
    this.selectedIndex = 0;
    this.others = 0;
    this.dashboardYear = year;
    this.getDataCurrYear();
  }

  getDataCurrYear() {
    this.amounts = [];
    this.offices = [];
    this.percentageOfGrowth = 0;
    if (this.isFirstStart) {
      this.http.get(`${this.wallService.API_URL}/offices`)
        .subscribe(
          res => {
            this.objOfAllData = Object.values(res);
            this.calculateData();
          }, err => { console.log(err) })
      this.isFirstStart = false;
    } else {
      this.calculateData();
    }
    this.getPercentageOfGrowth();
  }

  calculateData() {
    this.lastTotalAmounts = [];
    this.lastTotalAmount = 0

    for (let i = 0; i < this.objOfAllData.length; i++) {
      if (this.objOfAllData[i].year == this.dashboardYear) {
        this.offices.push(this.objOfAllData[i].office);
        this.amounts.push(this.objOfAllData[i].amount);
        this.totalAmounts = this.amounts.reduce((a, b) => a + b, 0);
      }
      if (this.objOfAllData[i].year == this.dashboardYear - 1) {
        this.lastTotalAmounts.push(this.objOfAllData[i].amount);
        this.lastTotalAmount = this.lastTotalAmounts.reduce((a, b) => a + b, 0);
      }
    }
  }

  getPercentageOfGrowth() {
    if (this.dashboardYear !== 2018) {
      this.percentageOfGrowth = Math.round(((this.totalAmounts - this.lastTotalAmount) / this.lastTotalAmount) * 100)
    }
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

}
