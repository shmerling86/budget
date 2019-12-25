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

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard-offices'
  },
  { path: 'dashboard-offices', component: DashboardComponent },
  { path: 'dashboard-expenses', component: DashboardExpensesComponent },
  { path: 'search', component: WallComponent },
  { path: 'new-office', component: OfficeComponent},
  { path: 'new-expense', component: ExpenseComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'contribution', component: ContributionComponent },
  { path: 'profile', component: UsersComponent },
  { path: '**', redirectTo: 'dashboard-offices' }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
