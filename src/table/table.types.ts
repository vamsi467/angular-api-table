import { IModule } from "@pcs/core-lib";
import { IColumnFormatterOptions } from "./types/formatter.types";

// todo separate types into files


export interface IDdsBadgeOptions {
    color?: 'informative' | 'success' | 'warning' | 'error' | 'gray' | 'brand';
    emphasis?: 'light' | 'medium' | 'heavy';
    size?: 'micro' | 'dot' | 'mini' | 'sm' | 'md' | 'lg';
}
export interface ITableOptions {
    locale?: string;
    currency?: string;
    filter?: ITableFilter;
    validationColumn?: any[];
}
export interface ITableFilter {
    enabled: boolean;
    columns?: ITableColumnOptions[];
}

export interface IColumnTag extends IDdsBadgeOptions {
    text: string;
    classes?: string;
}

export interface IColumnTagOptions {
    formater(row: any, column: ITableColumnOptions): IColumnTag[];
}

export interface IBaseTableColumnOptions {
    align?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
    verticalAlign?: 'flex-start' | 'center' | 'flex-end';
    contentPadding?: string;
    headerAlign?: 'left' | 'center' | 'right' | 'justify';
    width?: string | number;
    minWidth?: string | number;
    sort?: boolean;
    value: string;
    text: string;
    type: 'radio' | 'link' | 'checkbox';
    selectOptions?: never;
    optionValueField?: never;
    optionDisplayField?: never;
    currency?: string;
    formatterOptions?: never;
    emphasis?: never;
    displayField?: never;
    // todo: add strong typing
    validationOptions?: IValidationOptions;
    disable?: boolean;
    tags?: IColumnTagOptions;
    paddingRight?: string;
    showCompositePopover?(row: any): boolean;
    showErrorInfo?: boolean;
    cellTypeRenderer?:never;
    setCellData?:never;
}
export interface IValidationOptions {
    validation(value: any, column: ITableColumnOptions, row: any): boolean;
    disable: 'row' | 'cell';
    opacity?: number;
}

export interface INumberStringInputColumnOptions extends Omit<IBaseTableColumnOptions, 'type' | 'formatterOptions'> {
    type: 'input' | 'string' | 'number';
    formatterOptions?: IColumnFormatterOptions;
}
export interface ICustomColumnOptions extends Omit<IBaseTableColumnOptions, 'type' | 'cellTypeRenderer' | 'formatterOptions'| 'selectOptions' | 'optionValueField' | 'optionDisplayField' | 'setCellData'> {
    type: 'custom';
    cellTypeRenderer?(column: ITableColumnOptions, row: any, options?: any):  'string' | 'number' | 'link' | 'select' | 'radio' | 'checkbox' | 'input';
    formatterOptions?: IColumnFormatterOptions;
    selectOptions?: any[] | string[];
    optionValueField?: string;
    optionDisplayField?: string;
}
export interface ISelectColumnOptions extends Omit<IBaseTableColumnOptions, 'type' | 'selectOptions' | 'optionValueField' | 'optionDisplayField'> {
    type: 'select';
    selectOptions: any[] | string[];
    optionValueField?: string;
    optionDisplayField?: string;
}
export interface IBadgeColumnOptions extends Omit<IBaseTableColumnOptions, 'type' | 'emphasis' | 'formatterOptions'>, IDdsBadgeOptions {
    type: 'badge';
    formatterOptions?: IColumnFormatterOptions;
}

export interface IArrayColumnOptions extends Omit<IBaseTableColumnOptions, 'type' | 'displayField'> {
    type: 'array';
    displayField?: string;
}

export type ITableColumnOptions = ISelectColumnOptions | IBaseTableColumnOptions | IBadgeColumnOptions | INumberStringInputColumnOptions | IArrayColumnOptions | ICustomColumnOptions;
export interface IChange {
    type: 'select' | 'radio' | 'checkbox' | 'input';
    row: any;
    column: ITableColumnOptions;
    rowIndex: number;
    columnIndex: number;
    oldValue: any;
    event: any;
}
