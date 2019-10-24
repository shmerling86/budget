import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { ClickOutsideModule } from 'ng-click-outside';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard-offices/dashboard-offices.component';
import { WallComponent } from './components/wall/wall.component';
import { EditOfficeComponent } from './components/wall/edit-office/edit-office.component'
import { DeleteOfficeComponent } from './components/wall/edit-office/delete-office/delete-office.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OfficeComponent } from './components/office/office.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ContributionComponent } from './components/contribution/contribution.component';
import { SearchComponent } from './components/search/search.component';
import { DashboardExpensesComponent } from './components/dashboard-expenses/dashboard-expenses.component';
import { EditExpenseComponent } from './components/wall/edit-expense/edit-expense.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WallComponent,
    EditOfficeComponent,
    DeleteOfficeComponent,
    UsersComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    OfficeComponent,
    ExpenseComponent,
    ActivityComponent,
    ContributionComponent,
    SearchComponent,
    DashboardExpensesComponent,
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
    ClickOutsideModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
