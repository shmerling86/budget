import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOfficeComponent } from './delete-office.component';

describe('DeleteOfficeComponent', () => {
  let component: DeleteOfficeComponent;
  let fixture: ComponentFixture<DeleteOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
