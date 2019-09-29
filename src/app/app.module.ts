import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClickOutsideModule } from 'ng-click-outside';



import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { AuthComponent } from './components/tabs/auth/auth.component';
import { DashboardComponent } from './components/tabs/dashboard/dashboard.component';
import { WallComponent } from './components/tabs/wall/wall.component';
import { EditOfficeComponent } from './components/tabs/wall/edit-office/edit-office.component'
import { EditExpenseComponent } from './components/tabs/wall/edit-expense/edit-expense.component';
import { DeleteOfficeComponent } from './components/tabs/wall/edit-office/delete-office/delete-office.component';

import { FusionChartsModule } from "angular-fusioncharts";

import * as FusionCharts from "fusioncharts";
import * as FusionMaps from "fusioncharts/fusioncharts.maps";
import * as World from 'fusioncharts/maps/fusioncharts.world';

import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { UsersComponent } from './components/tabs/users/users.component';

FusionChartsModule.fcRoot(
  FusionCharts,
  FusionMaps,
  World,
  FusionTheme
);

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    AuthComponent,
    DashboardComponent,
    WallComponent,
    EditOfficeComponent,
    DeleteOfficeComponent,
    UsersComponent,
    EditExpenseComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    FusionChartsModule,
    ClickOutsideModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
