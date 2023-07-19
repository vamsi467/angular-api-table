import { CurrencyPipe, PercentPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTableCellComponent } from './input-table-cell.component';

describe('InputTableCellComponent', () => {
  let component: InputTableCellComponent;
  let fixture: ComponentFixture<InputTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTableCellComponent ],
      providers: [CurrencyPipe, PercentPipe]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
