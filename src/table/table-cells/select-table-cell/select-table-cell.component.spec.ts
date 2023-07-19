import { CurrencyPipe, PercentPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTableCellComponent } from './select-table-cell.component';

describe('SelectTableCellComponent', () => {
  let component: SelectTableCellComponent;
  let fixture: ComponentFixture<SelectTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTableCellComponent ],
      providers: [CurrencyPipe, PercentPipe]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
