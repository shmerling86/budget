import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExpensesComponent } from './dashboard-expenses.component';

describe('DashboardExpensesComponent', () => {
  let component: DashboardExpensesComponent;
  let fixture: ComponentFixture<DashboardExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
