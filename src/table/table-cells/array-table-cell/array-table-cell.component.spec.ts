import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayTableCellComponent } from './array-table-cell.component';

describe('ArrayTableCellComponent', () => {
  let component: ArrayTableCellComponent;
  let fixture: ComponentFixture<ArrayTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrayTableCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
