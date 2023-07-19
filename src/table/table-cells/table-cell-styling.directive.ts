import { Directive, ElementRef, HostBinding, Input, OnChanges, OnInit } from '@angular/core';
import { ITableColumnOptions } from '../table.types';

@Directive({
  selector: '[table-cell-styling]'
})
export class TableCellStylingDirective implements OnChanges {

  @Input() column = {} as ITableColumnOptions;
  constructor(private el: ElementRef) {

  }

  ngOnChanges(): void {
    if (this.el.nativeElement) {
      this.el.nativeElement.style.minWidth = this.column.minWidth || this.column.width;
      this.el.nativeElement.style.maxWidth = this.column.width;
      this.el.nativeElement.style.alignItems = this.column.verticalAlign || 'center';
      this.el.nativeElement.style.justifyContent = this.getAlignMentClasses(this.column);
    }

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
