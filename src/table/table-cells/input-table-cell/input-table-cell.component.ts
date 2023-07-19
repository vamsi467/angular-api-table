
import { ITableColumnOptions } from '../../table.types';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { IChange, IColumnTag, ITableOptions } from '../../table.types';
import { get as _get, set as _set, orderBy as _orderBy } from 'lodash';
import { CurrencyPipe, PercentPipe } from "@angular/common";

@Component({
  selector: '[input-table-cell]',
  templateUrl: './input-table-cell.component.html',
  styleUrls: ['./input-table-cell.component.scss']
})
export class InputTableCellComponent implements OnInit, OnChanges {

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
  value = null;
  @Input() expandable = false;
  @ViewChild('normalInput') input:ElementRef
  focused = false

  constructor(private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe,) {

  }
  ngOnChanges(changes: SimpleChanges): void {

    this.value = this.getFormattedValue();


  }
  ngOnInit(): void {
    this.value = this.getFormattedValue()
  }



  getFormattedValue() {
    const formatOptions = this.column?.formatterOptions
    let val = _get(this.row, this.column?.value);
    switch (this.column?.formatterOptions?.type) {
      case 'currency':

        return parseInt(formatOptions?.formater ? formatOptions?.formater(val, this.column, this.row) : val);
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
    const val = _get(this.row, this.column.value);
    return val
  }

  getTextTransform(val, formatOptions) {
    return formatOptions.case ? formatOptions.case === 'uppercase' ? val.toUpperCase() : val.toLowerCase() : val;
  }

  onChange(event, row, column, rowIndex, columnIndex, type) {
    _set(row, column.value, event.target.value);
    // todo set is modified
  }

  onFocus(){
    this.focused = true
    setTimeout(()=>{
      this.input.nativeElement.focus()
    })
  }

  onBlur(event, row, column, rowIndex, columnIndex, type) {

    this.focused = false;
    const oldValue = _get(row, column.value)
    _set(row, column.value, Number(event.target.value.replace(/[^0-9.-]+/g, "")));
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