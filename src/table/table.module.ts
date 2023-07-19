import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { TableComponent } from './table.component';
import { TableRowGroupComponent } from './table-row-group/table-row-group.component';
import { TableRowComponent } from './table-row/table-row.component';
import { ButtonModule, PopoverModule } from '@pcs/components-lib';
import { NumberStringTableCellComponent } from './table-cells/number-string-table-cell/number-string-table-cell.component';
import { ArrayTableCellComponent } from './table-cells/array-table-cell/array-table-cell.component';
import { TableCellStylingDirective } from './table-cells/table-cell-styling.directive';
import { CurrencyInputDirective } from './currency-input.directive';
import { InputTableCellComponent } from './table-cells/input-table-cell/input-table-cell.component';
import { SelectTableCellComponent } from './table-cells/select-table-cell/select-table-cell.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [TableComponent, TableRowGroupComponent, TableRowComponent, NumberStringTableCellComponent, ArrayTableCellComponent, TableCellStylingDirective, CurrencyInputDirective, InputTableCellComponent, SelectTableCellComponent],
  imports: [
    CommonModule,
    ButtonModule,
    PopoverModule,
    FormsModule
  ],
  exports: [TableComponent],
  providers: [CurrencyPipe, PercentPipe, ]
})
export class TableModule { }
