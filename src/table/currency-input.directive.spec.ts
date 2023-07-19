import { CurrencyPipe } from '@angular/common';
import { ElementRef } from '@angular/core';
import { CurrencyInputDirective } from './currency-input.directive';

describe('CurrencyInputDirective', () => {
  it('should create an instance', () => {
    const directive = new CurrencyInputDirective({} as ElementRef, {} as CurrencyPipe);
    expect(directive).toBeTruthy();
  });
});
