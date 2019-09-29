import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Office } from 'src/app/interfaces/office';

import { WallService } from '../../../services/wall.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  API_URL: string = this.wallService.API_URL;
  isFirstStart: boolean = true;
  objOfAllData;
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
      },
    }
  }

  public pieChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];

  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';
  public ChartColors = this.wallService.ChartColors

  public doughnutChartOptions = {
    legend: {
      position: 'left',
    }
  }
  officesWithExpenses: Array<any> = [];
  officesWithExpensesFiltered: Array<any> = [];
  dataSource: Object;
  api: string = this.wallService.API_URL;
  totalAllAmounts: any = 0;
  others: number = 0;
  changeColorBtnExpenses: boolean = false;

  constructor(
    private http: HttpClient,
    public wallService: WallService,
    public spinner: NgxSpinnerService) {

    // this.dataSource = {
    //   chart: {
    //     caption: "GDP per capita",
    //     subcaption: "2019",
    //     numbersuffix: "K",
    //     includevalueinlabels: "1",
    //     labelsepchar: ": ",
    //     entityFillHoverColor: "#FFF9C4",
    //     theme: "fusion",
    //     bgColor: "ebebeb",
    //     bgratio: "60,40",
    //     bgAlpha: "70,80",
    //     bgAngle: "180"

    //   },
    //   // Aesthetics; ranges synced with the slider
    //   colorrange: {
    //     minvalue: "0",
    //     code: "#c7c7c7",
    //     gradient: "1",
    //     color: [
    //       {
    //         minvalue: "1,000",
    //         maxvalue: "10,000",
    //         color: "#d4d3d3"
    //       },
    //       {
    //         minvalue: "10,001",
    //         maxvalue: "30,000",
    //         color: "#8a8989"
    //       },
    //       {
    //         minvalue: "30,001",
    //         maxvalue: "60,000",
    //         color: "#6d6c6c"
    //       }
    //     ]
    //   },
    //   // Source data as JSON --> id represents countries of world.
    //   data: [
    //     {
    //       id: "NA",
    //       value: "49,240",
    //       showLabel: "1"
    //     },
    //     {
    //       id: "SA",
    //       value: "8,560",
    //       showLabel: "1"
    //     },
    //     {
    //       id: "AS",
    //       value: "7,350",
    //       showLabel: "1"
    //     },
    //     {
    //       id: "EU",
    //       value: "29,410",
    //       showLabel: "1"
    //     },
    //     {
    //       id: "AF",
    //       value: "1,930	",
    //       showLabel: "1"
    //     },
    //     {
    //       id: "AU",
    //       value: "53,220",
    //       showLabel: "1"
    //     }
    //   ]
    // };
  }

  ngOnInit() {
    this.spinner.show();
    this.getDataCurrYear();
    this.getExpensesData();
  }

  changeYear(year?) {
    this.selectedIndex = 0;
    if (year == 'future' && this.dashboardYear != 2020) {
      this.dashboardYear = this.dashboardYear + 1;
    } else if (year == undefined && this.dashboardYear != 2018) {
      this.dashboardYear = this.dashboardYear - 1;
    }
    this.getExpensesData();
    this.getDataCurrYear();
  }

  getDataCurrYear() {
    this.amounts = [];
    this.offices = [];
    this.percentageOfGrowth = 0;
    if (this.isFirstStart) {
      this.http.get(this.api + '/offices')
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
      if (this.objOfAllData[i].years == this.dashboardYear) {
        this.offices.push(this.objOfAllData[i].office)
        this.amounts.push(this.objOfAllData[i].amount)
        this.totalAmounts = this.amounts.reduce((a, b) => a + b, 0);
      }
      if (this.objOfAllData[i].years == (this.dashboardYear - 1)) {
        this.lastTotalAmounts.push(this.objOfAllData[i].amount)
        this.lastTotalAmount = this.lastTotalAmounts.reduce((a, b) => a + b, 0);
      }
    }
  }

  getPercentageOfGrowth() {
    if (this.dashboardYear !== 2018) {
      this.percentageOfGrowth = Math.round(((this.totalAmounts - this.lastTotalAmount) / this.lastTotalAmount) * 100)
    }
  }

  getExpensesData(clickedOffice?) {
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.officesWithExpenses = [];
    this.wallService.getRandColor();
    this.http.get(`${this.API_URL}/expenses?year=${this.dashboardYear}`)
      .subscribe(
        expenses => {
          if (clickedOffice == undefined) {
            this.getOfficeAmount(expenses[0].office);
          } else {
            this.getOfficeAmount(clickedOffice);
          }
          for (const key in expenses) {
            const expense = expenses[key];
            this.officesWithExpenses.push(expense.office)
            this.officesWithExpensesFiltered = [...new Set(this.officesWithExpenses)]

            if (clickedOffice == undefined) {
              if (expense.office == expenses[0].office) {
                this.doughnutChartLabels.push(expense.title);
                this.doughnutChartData.push(Number(expense.amount));
                this.totalAllAmounts = this.doughnutChartData.reduce((a, b) => { return a + b; });
              }
            } else {
              if (expense.office == clickedOffice) {
                this.doughnutChartLabels.push(expense.title);
                this.doughnutChartData.push(Number(expense.amount));
                this.totalAllAmounts = this.doughnutChartData.reduce((a, b) => { return a + b; });
              }
            }
          }
          this.changeColorBtnExpenses = !this.changeColorBtnExpenses;

        },
        err => {
          console.log(err);
        }
      )

  }

  getOfficeAmount(office) {
    this.http.get(`${this.API_URL}/offices?office=${office}`)
      .subscribe(
        res => {
          this.others = Number(res[0].amount) - this.totalAllAmounts;
          this.doughnutChartLabels.push("Others");
          this.doughnutChartData.push(this.others);
        },
        err => {
          console.log(err)
        }

      )
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

}
