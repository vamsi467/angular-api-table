import { CurrencyPipe, PercentPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowComponent } from './table-row.component';

describe('TableRowComponent', () => {
  let component: TableRowComponent;
  let fixture: ComponentFixture<TableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableRowComponent ],
      providers: [
        CurrencyPipe,
        PercentPipe
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
