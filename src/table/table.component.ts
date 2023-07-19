// todo add validation at row level
// todo message for table length 0

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { IModuleOption } from "@pcs/core-lib";
import { get as _get, set as _set, orderBy as _orderBy } from 'lodash';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from "rxjs";
import { OrderCodeDataService } from "../../order-code-data.service";
import { ConfigService } from "../../services/config.service";
import { sortIconMap } from "./models/sort-icon-map";
import { IChange, ITableColumnOptions, ITableOptions } from "./table.types";
import { cloneDeep as _cloneDeep } from 'lodash';

@Component({
  selector: `dds-table`,
  templateUrl: `./table.component.html`,
  styleUrls: [`./table.component.scss`],
})

export class TableComponent implements OnInit, OnDestroy, OnChanges {
  @Output() change: EventEmitter<IChange> = new EventEmitter();
  @Input() columns: ITableColumnOptions[] = [];
  @Input() data: IModuleOption[] = [];
  @Input() groupedData: {[key: string]: IModuleOption[]};
  @Input() isCompositeAvailable: boolean = false;
  @Input() tableOptions: ITableOptions = {
    currency: 'USD',
    locale: 'en-US',
    filter: {
      enabled: false
    }
  };
  @Input() isGlobalPortal :boolean = false;
  storeId = ''
  sortIconMap = sortIconMap;
  sortColumnIndex = null;
  sortDirection = ['none', 'asc', 'desc'];
  optionGroupKeys = [];

  //Create a copy of data
  copy: any[];

  //Create search subject and subscription
  readonly searchSubject = new Subject<string>();
  searchSubscription?: Subscription;

  //Highlighter
  highlightSearchText: string;
  ocModuleDetailsMap = {}
  showOnlyIncluded: boolean;

  constructor(private _ocDataService: OrderCodeDataService, private _configService: ConfigService) { }

  ngOnInit(): void {
    this.subscribeToSearch();
    this.copy = [...this.data];
    this._ocDataService.getOrderCodeModuleDetailsMap$.subscribe(res => {
      this.ocModuleDetailsMap = res;
    })
    this._configService.editModeChanges$.subscribe((result) => {
      this.showOnlyIncluded = result !== 'edit';

    })
    this._configService.configChanged$.subscribe((res) => {
      this.storeId = res.storeId;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.copy = [...this.data];
    }
    if(changes['groupedData'] && this.groupedData) {
      this.optionGroupKeys = Object.keys(this.groupedData);
    }
  }

  showOption(option: IModuleOption): boolean {
    if (this.showOnlyIncluded) {
      return option.extension.isIncluded;
    }
    return true;
  }

  getNoDataText() {
    if (this.showOnlyIncluded) {
      return !this.data.length ? 'No options for this module' : ''
    }
    return !this.ocModuleDetailsMap[this.data?.[0]?.extension?.moduleId]?.defaultedOptions?.length ? 'No defaulted option' : ''
  }

  isComposite(row): boolean {
    return this.isGlobalPortal  && row.compositeId && row.isComposite && row.optionType.id === 9
  }

  setModuleChange(event) {
    let setIsIncluded = event.column?.value === 'extension.isIncluded' ? true : false;
    if (event.column?.text === 'Default') {
      this.data.map((option, index) => {
        if (event.type === 'radio') {
          if (index !== event.rowIndex) {
            _set(option, event.column.value, false);
          } else {
            if (!option.extension.isIncluded) {
              setIsIncluded = true;
            }
            _set(option, 'extension.isIncluded', true);
          }
        } else if (event.type === 'checkbox') {
          if (index === event.rowIndex && option.extension.isDefault) {
            if (!option.extension.isIncluded) {
              setIsIncluded = true;
            }
            _set(option, 'extension.isIncluded', true);
          } 
        }
      });
    }
    this.change.emit({...event, setIsIncluded});
  }
  
  setCompositeModuleChange(event) {
    if (event.update) {
      this.setModuleChange(event);
    } else {
      this.change.emit(event);
    }
  }
  tableTrackBy(index) {
    return index
  }




  //#region "Filter options"

  subscribeToSearch() {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchText) =>
          this.search(searchText)
        ))
      .subscribe((result) => {
        this.data.push(result);
      });
  }

  onSearchTextInput(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value;
    this.highlightSearchText = searchText;
    this.searchSubject.next(searchText?.trim());
  }

  search(searchText: string) {
    let data = this.copy;
    this.data = [];
    if (searchText && searchText.length > 0) {
      searchText = searchText.toLowerCase();
      data = data.filter(object => this.searchInObject(object, searchText));
    }
    return data;
  }

  searchInObject(object: any, searchText: string) {
    let searchColumns = this.getSearchColumns();
    return searchColumns.some(column => {
      let value;
      if (column.type === 'array')
        value = this.getArrayValue(object, column);
      else
        value = this.getValue(object, column);
      return value?.toString().toLowerCase().includes(searchText) ? true : false;
    });
  }

  getSearchColumns() {
    let searchColumns: ITableColumnOptions[];
    if (this.tableOptions.filter?.columns && this.tableOptions.filter?.columns.length > 0) {
      searchColumns = this.tableOptions.filter?.columns;
    } else {
      const searchTypes = ["string", "number", "array"];
      searchColumns = this.columns.filter(x => searchTypes.some(type => x.type == type));
    }
    return searchColumns;
  }

  //#end region "Filter options"

  public ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  rotateQueue() {
    const ele = this.sortDirection.shift() || '';

    this.sortDirection.push(ele)
  }

  resetQueue() {
    this.sortDirection = ['none', 'asc', 'desc'];
  }

  orderBy(column, columnIndex) {
    if (!column.sort) {
      return
    }
    if (this.sortColumnIndex !== columnIndex) {
      this.resetQueue();
    }
    this.rotateQueue();

    this.sortColumnIndex = columnIndex;

    if (this.sortDirection[0] === 'none') {
      this.data = [...this.copy];
    }
    else {
      this.data = _orderBy(this.data, (row) => {
        if (column.type === 'array') {
          return this.getArrayValue(row, column,);
        }
        else {
          return this.getValue(row, column);
        }
      }, this.sortDirection[0]);
    }
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

  getValue(row, column: ITableColumnOptions, defaultValue = null) {
    const val = _get(row, column.value);
    return val
  }


}


