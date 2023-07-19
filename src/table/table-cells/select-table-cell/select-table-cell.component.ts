import { ITableColumnOptions } from '../../table.types';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { IChange, IColumnTag,  ITableOptions } from '../../table.types';
import { get as _get, set as _set, orderBy as _orderBy } from 'lodash';
import { CurrencyPipe, PercentPipe } from "@angular/common";

@Component({
  selector: '[select-table-cell]',
  templateUrl: './select-table-cell.component.html',
  styleUrls: ['./select-table-cell.component.scss']
})
export class SelectTableCellComponent implements OnInit, OnChanges {

  
  @Input() row: any = {}
  @Input() rowIndex: null | number = null;
  @Input() columnIndex: null | number = null;
  @Output() change: EventEmitter<IChange> = new EventEmitter();
  @Input() loading = false;
  @Input() column
  @Input() tableOptions: ITableOptions = {
    currency: 'USD',
    locale: 'en-US',
    filter: {
      enabled: false
    }
  };
  value=null;
  @Input() expandable = false;

  constructor(private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe,) {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
   
    
      this.value = this.getValue();

    
  }
  ngOnInit(): void {
    this.value = this.getValue() 
  }

  

  getFormattedValue() {
    const formatOptions = this.column.formatterOptions
    let val = _get(this.row, this.column.value);
    switch (this.column.formatterOptions?.type) {
      case 'currency':
        
        return  formatOptions?.formater ? formatOptions?.formater(val, this.column, this.row) : val;
      case 'percentage':
        return this.percentPipe.transform(val, undefined, this.tableOptions.locale);
      case 'text':
        return (formatOptions?.prefix || '') + this.getTextTransform(val, formatOptions) + (formatOptions?.suffix || '');
      case 'custom':
        return formatOptions?.formater ? formatOptions?.formater(val, this.column, this.row) : val;
    }
    return val
  }

  getValue() {
    const val = _get(this.row, this.column?.value);
    
    
    return val
  }
  
  getOptionValue( option) {
    if (typeof option === 'object') {
      
      return option[this.column.optionValueField]
    }
    return option;
  }

  getOptionName( option) {
    if (typeof option === 'object') {
      return option[this.column.optionDisplayField]
    }
    return option;
  }


  

  getTextTransform(val, formatOptions) {
    return formatOptions.case ? formatOptions.case === 'uppercase' ? val.toUpperCase() : val.toLowerCase() : val;
  }
  onChange(event, row, column, rowIndex, columnIndex, type) {
    const oldValue = _get(row, column.value)
    _set(row, column.value, event.target.value);

    // todo set is modified

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

}
