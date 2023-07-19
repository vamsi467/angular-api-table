import { IModule, IModuleOption, IOrderCodeDetails } from '@pcs/core-lib';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ITableColumnOptions, IChange, ITableOptions } from '../table.types';
import { OrderCodeService } from '@pcs/core-lib';
import { catchError, throwError, finalize } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import * as ocUtils from '../../../utils/oc-utils'
import { OrderCodeDataService, OrderCodeStatusEnum } from '../../../order-code-data.service';
import { set as _set } from 'lodash';

@Component({
  selector: 'dds-table-row-group,[dds-table-row-group]',
  templateUrl: './table-row-group.component.html',
  styleUrls: ['./table-row-group.component.css'],

})
export class TableRowGroupComponent implements OnInit {
  @Input() row: IModuleOption = {} as IModuleOption;
  @Input() rowIndex: null | number = null;
  @Input() columns: ITableColumnOptions[] = [];
  @Output() change: EventEmitter<IChange> = new EventEmitter();
  @Input() tableOptions: ITableOptions = {
    currency: 'USD',
    locale: 'en-US',
    filter: {
      enabled: false
    }
  };
  @Input() storeId: string = '';
  @Input() orderCodeId: string = '';
  @Input() isCompositeAvailable = false;
  @Input() isCompositeRow = false;

  expanded = false
  @ViewChild('rowGroupTemplate', { static: true }) rowGroupTemplate: TemplateRef<any>;
  rowData: any[] = []
  loading: boolean = false;
  error = false;
  expandable = true;
  isEditMode: boolean = false;
  modules: any[] = [];
  ocUtils = ocUtils;
  details = {
    defaultedOptions: [],
    includedOptions: [],
    count: 0
  }
  constructor(private view: ViewContainerRef,
    private configService: ConfigService,
    private _ocDataService: OrderCodeDataService,
  ) { }

  ngOnInit(): void {
    if (this.view) {
      this.view.createEmbeddedView(this.rowGroupTemplate);
    }
    this.configService.editModeChanges$.subscribe((result) => {
      this.isEditMode = result === 'edit';
    })
    this._ocDataService.getChildOrderCode$(this.orderCodeId).subscribe((res: IOrderCodeDetails) => {
      this.modules = res ? res.modules : []
      this.setModuleDetails();
    })
    this._ocDataService.getChildOrderCodeStatus$(this.orderCodeId).subscribe((res: OrderCodeStatusEnum) => {
      this.error = res === OrderCodeStatusEnum.ERROR;
      this.loading = res === OrderCodeStatusEnum.LOADING;
    })
  }

  expandRow(event) {
    this.expanded = event;
  }

  hasIncludedOptions(module) {
    return this.isEditMode ? module.options.length : module.options.some(ele => ele.extension.isIncluded);
  }

  setModuleDetails() {
    this.details = {
      defaultedOptions: [],
      includedOptions: [],
      count: 0
    }
    queueMicrotask(() => {
      this.modules.map((module) => {
        module.options.map((next) => {
          if (next.extension.isDefault) {
            this.details.defaultedOptions.push(`${next.externalName} [${next.id}]`);
          } else if (next.extension.isIncluded) {
            this.details.includedOptions.push(`${next.externalName} [${next.id}]`);
          }
        })
      });
      if (this.details.defaultedOptions.length + this.details.includedOptions.length) {
        this.details.count = this.details.defaultedOptions.length + this.details.includedOptions.length
      }
    })
  }
  rowChange(event?: any, module?: IModule, triggerCall?: boolean, parentRow?: any) {
    this.setModuleDetails();
    // Updating when default value changed
    if (event) {
      if (module && event.column?.text === 'Default') {
        module.options.map((option, index) => {
          if (event.type === 'radio') {
            if (index !== event.rowIndex) {
              _set(option, event.column.value, false);
            } else {
              _set(option, 'extension.isIncluded', true);
            }
          } else if (event.type === 'checkbox') {
            if (index === event.rowIndex && option.extension.isDefault) {
              _set(option, 'extension.isIncluded', true);
            } 
          }
        });
      }
      if (!module &&
        (event.column?.value === 'extension.isIncluded' ||
        event.column?.value === 'extension.isDefault')) {
        if (event.event?.target?.checked) {
          this.expandable = true;
        } else if (event.column?.value === 'extension.isIncluded') {
          this.expandable = false;
        }
      }
      this.change.emit({...event, parentRow, update: !module ? true: false, triggerCall, orderCodeId: this.orderCodeId });
    }
  }
}
