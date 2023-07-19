import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IChange, ITableColumnOptions, ITableOptions } from '../table.types';
import { get as _get, set as _set, orderBy as _orderBy } from 'lodash';
import { CurrencyPipe, PercentPipe } from "@angular/common";
@Component({
  selector: 'table-row, [table-row]',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css'],
})
export class TableRowComponent implements OnInit {
  @Input() row: any = {}
  @Input() rowIndex: null | number = null;
  @Input() columns: ITableColumnOptions[] = [];
  @Output() change: EventEmitter<IChange> = new EventEmitter();
  @Output() expansion: EventEmitter<boolean> = new EventEmitter();
  @Input() loading = false;
  @Input() error = false;
  @Input() disableDefault = false;
  @Input() details = {
    defaultedOptions: [],
    includedOptions: [],
    count: 0
  }
  @Input() tableOptions: ITableOptions = {
    currency: 'USD',
    locale: 'en-US',
    filter: {
      enabled: false
    }
  };
  @Input() expandable = false;
  @Input() isCompositeAvailable = false;
  @Input() isSingleSelect?: boolean;
  computedColumns: ITableColumnOptions[] = []
  expanded = false;
  constructor(private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe) { }

  ngOnInit(): void {
    this.computeColumns()
  }
  computeColumns(){
    this.computedColumns = this.columns.map((ele: ITableColumnOptions) => {
      const newEle: ITableColumnOptions = { ...ele }
      if (ele.type === 'custom') {
        newEle.type = ele.cellTypeRenderer(ele, this.row, {isSingleSelect: this.isSingleSelect})
      }

      return newEle

    })
  }
  


  getCheckBoxValue(row, column) {
    const val = _get(row, column.value);
    if (typeof val === 'boolean') {
      return val;
    }

    return val === 'true' || val === '1';
  }
  getColumnValidationStatus(row, column: ITableColumnOptions, defaultValue = null) {
    if (row?.error?.isError || (column.text === 'Default' && this.disableDefault)) return true;
    const validationOptions = column.validationOptions;
    const val = _get(row, column.value);

    return validationOptions ? validationOptions.disable === 'cell' && validationOptions?.validation(val, column, row) : false;
  }

  getRowValidationStatus(row, column: ITableColumnOptions, defaultValue = null) {
    const validationOptions = column.validationOptions;
    const val = _get(row, column.value);
    return validationOptions ? validationOptions.disable === 'row' && validationOptions?.validation(val, column, row) : false;
  }

  getFormattedValue(row, column: ITableColumnOptions, defaultValue = null) {
    const formatOptions = column.formatterOptions
    let val = _get(row, column.value);
    switch (column.formatterOptions?.type) {
      case 'currency':
        const formattedValue= formatOptions?.formater ? formatOptions?.formater(val, column, row) : val;
        return this.currencyPipe.transform(formattedValue, formatOptions?.currency || this.tableOptions.currency, formatOptions?.display || 'symbol', undefined, this.tableOptions.locale);
      case 'percentage':
        return this.percentPipe.transform(val, undefined, this.tableOptions.locale);
      case 'text':
        return (formatOptions?.prefix || '') + this.getTextTransform(val, formatOptions) + (formatOptions?.suffix || '');
      case 'custom':
        return formatOptions?.formater ? formatOptions?.formater(val, column, row) : val;
    }
    return val
  }

  getArrayValue(row, column, returnArray?) {
    const val = _get(row, column.value);
    if (column.displayField) {
      if (returnArray) {
        return val.map((ele) => ele[column.displayField])
      }
      return val.map((ele) => ele[column.displayField]).join()
    }
    if (returnArray) {
      return val;
    }
    return val.join()
  }

  getTags(row, column: ITableColumnOptions) {
    const tagOptions = column.tags;
    return tagOptions?.formater(row, column);
  }

  getValue(row, column: ITableColumnOptions, defaultValue = null) {
    const val = _get(row, column.value);
    
    
    return val
  }

  getTextTransform(val, formatOptions) {
    return formatOptions.case ? formatOptions.case === 'uppercase' ? val.toUpperCase() : val.toLowerCase() : val;
  }



  getAlignMentClasses(column: ITableColumnOptions) {

    if (column.align) {
      return column.align;
    }
    if (column.type === 'badge' || column.type === 'radio' || column.type === 'checkbox') {
      return 'center';
    }
    if (column.formatterOptions?.type == 'currency') {
      return 'flex-end'
    }
    return 'flex-start';
  }

  onChangeSelectAndInput(event, row, column, rowIndex, columnIndex, type, oldValue) {
    
    
    this.computeColumns()

    this.change.emit({
      type,
      row,
      column,
      rowIndex,
      columnIndex,
      oldValue,
      event,
    })
  }
  onChange(event, row, column, rowIndex, columnIndex, type) {
    const oldValue = _get(row, column.value)
    if (column.type === 'radio' || column.type === 'checkbox') {
      _set(row, column.value, event.target.checked);
    }

    // todo set is modified
    this.computeColumns()
    this.change.emit({
      type,
      row,
      column,
      rowIndex,
      columnIndex,
      oldValue,
      event,
    })
  }

  expandRow() {
    this.expanded = !this.expanded
    this.expansion.emit(this.expanded)
  }
}
