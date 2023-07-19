import { Component, ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';

import { IChange, IColumnTag, ITableColumnOptions, ITableOptions } from '../../table.types';
import { get as _get, set as _set, orderBy as _orderBy } from 'lodash';
import { CurrencyPipe, PercentPipe } from "@angular/common";

@Component({
  selector: '[number-string-table-cell]',
  templateUrl: './number-string-table-cell.component.html',
  styleUrls: ['./number-string-table-cell.component.scss'],
})
export class NumberStringTableCellComponent implements OnInit {

  @Input() row: any = {}
  @Input() rowIndex: null | number = null;
  @Input() loading = false;
  @Input() column
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
  tags: IColumnTag[] = []
  @Input() expandable = false;
  value=null

  constructor(private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe,) {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    
      this.value = this.getFormattedValue();

    
  }
  ngOnInit(): void {
    this.value = this.getFormattedValue() 
  
    this.computeTags()
    
  }

  showPopover() {
    return !!(
      this.column.showCompositePopover &&
      this.column.showCompositePopover(this.row) &&
      this.details.count
    )
  }

  getFormattedValue() {
    const formatOptions = this.column.formatterOptions
    let val = _get(this.row, this.column.value);
    switch (this.column.formatterOptions?.type) {
      case 'currency':
        const formattedValue= formatOptions?.formater ? formatOptions?.formater(val, this.column, this.row) : val;
        return this.currencyPipe.transform(formattedValue, formatOptions?.currency || this.tableOptions.currency, formatOptions?.display, undefined, this.tableOptions.locale);
      case 'percentage':
        return this.percentPipe.transform(val, undefined, this.tableOptions.locale);
      case 'text':
        return (formatOptions?.prefix || '') + this.getTextTransform(val, formatOptions) + (formatOptions?.suffix || '');
      case 'custom':
        return formatOptions?.formater ? formatOptions?.formater(val, this.column, this.row) : val;
    }
    return val
  }

  

  getTextTransform(val, formatOptions) {
    return formatOptions.case ? formatOptions.case === 'uppercase' ? val.toUpperCase() : val.toLowerCase() : val;
  }

  computeTags() {
    const tagOptions = this.column.tags;
    this.tags = tagOptions?.formater(this.row, this.column).map(tag => ({ ...tag, classes: this.getBadgeClasses(tag) }));
  }
  getBadgeClasses(tag) {
    const baseClassName = 'dds__badge--'
    const emphasisClass = tag.emphasis ? baseClassName + tag.emphasis : '';
    const colorClass = tag.color ? baseClassName + tag.color : '';
    const sizeClass = tag.size ? baseClassName + tag.color : '';
    return `dds__badge dds__badge--md ${emphasisClass} ${colorClass} ${sizeClass}`;
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

}
