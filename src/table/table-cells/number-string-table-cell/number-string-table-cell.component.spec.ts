import { PercentPipe } from "@angular/common";
import { CurrencyPipe } from "@angular/common";
import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NumberStringTableCellComponent } from "./number-string-table-cell.component";
describe("NumberStringTableCellComponent", () => {
  let component: NumberStringTableCellComponent;
  let fixture: ComponentFixture<NumberStringTableCellComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [NumberStringTableCellComponent],
      providers: [CurrencyPipe, PercentPipe],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(NumberStringTableCellComponent);
    component = fixture.componentInstance;
    component.column = {};
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
