import { ITableColumnOptions } from "../table.types";

export interface IBaseColumnFormatterOptions {
    type?: 'custom' | 'date' | 'percentage' | 'text' | 'currency';
    value?: never;
    format?: never;
    currency?: never;
    display?: never;
    timezone?: never;
    prefix?: never;
    suffix?: never;
    case?: never;
    formater?();
}

export interface IPercentageFormatOptions extends Omit<IBaseColumnFormatterOptions, 'type'> {
    type: 'percentage';
}

export interface IDateFormatOptions extends Omit<IBaseColumnFormatterOptions, 'type' | 'format' | 'timezone'> {
    type: 'date';
    format?: string;
    timezone?: string;
}
export interface ICustomFormatOptions extends Omit<IBaseColumnFormatterOptions, 'type' | 'formater'> {
    type: 'custom';
    formater(value: any, column: ITableColumnOptions, row: any): string | number;
}
export interface ITextFormatOptions extends Omit<IBaseColumnFormatterOptions, 'type' | 'prefix' | 'suffix' | 'case'> {
    type: 'text';
    prefix?: string;
    suffix?: string;
    case?: 'uppercase' | 'lowercase';
}

export interface ICurrencyFormatOptions extends Omit<IBaseColumnFormatterOptions, 'type' | 'currency' | 'display'| 'formater'> {
    type: 'currency';
    currency?: string;
    display?: 'code' | 'symbol' | 'symbol-narrow';
    formater?(value: any, column: ITableColumnOptions, row: any): string | number;
}

export type IColumnFormatterOptions = IDateFormatOptions | IPercentageFormatOptions | ICurrencyFormatOptions | ITextFormatOptions | ICustomFormatOptions;
