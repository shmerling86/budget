import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard-offices/dashboard-offices.component';
import { DashboardExpensesComponent } from './components/dashboard-expenses/dashboard-expenses.component';
import { WallComponent } from './components/wall/wall.component';
import { OfficeComponent } from './components/office/office.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ContributionComponent } from './components/contribution/contribution.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard-offices',
    pathMatch: 'full'
  },
  { path: 'dashboard-expenses', component: DashboardExpensesComponent },
  { path: 'dashboard-offices', component: DashboardComponent },
  { path: 'search', component: WallComponent },
  { path: 'new-office', component: OfficeComponent },
  { path: 'new-expense', component: ExpenseComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'contribution', component: ContributionComponent },
  { path: 'profile', component: UsersComponent },
  { path: 'login', component: LoginComponent }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
