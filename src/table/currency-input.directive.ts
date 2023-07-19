import { CurrencyPipe } from "@angular/common";
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from "@angular/core";


@Directive({
  selector: "[currency-input]",
})
export class CurrencyInputDirective implements OnInit {
  @Input() align: 'start' | 'end' = 'end';
  @Input() currency: string | undefined;

  constructor(private elementRef: ElementRef, private currencyPipe: CurrencyPipe) {

  }
  
  ngOnInit(): void {
    const ele: ElementRef['nativeElement'] = this.elementRef.nativeElement;
    ele.value = this.currencyFormat(ele.value)
    ele.style.textAlign = this.align
  }

  @HostListener("blur", ["$event"])
  handleBlur(event: any) {
    this.elementRef.nativeElement.value = this.currencyFormat(this.elementRef.nativeElement.value)
  }

  @HostListener("focus", ["$event"])
  handleFocus(event: any) {
    this.elementRef.nativeElement.value = Number(this.elementRef.nativeElement.value.replace(/[^0-9.-]+/g, ""));
  }

  @HostListener("keydown", ["$event"])
  handleKeydown(event: any) {
    this.acceptOnlyNumbers(event, event.key)
  }

  @HostListener("paste", ["$event"])
  handlePaste(event: any) {
    
    const data = event.clipboardData.getData('text/html')
    this.acceptOnlyNumbers(event, data)
  }

  isReadOnly(): boolean {
    return this.elementRef.nativeElement.hasAttribute('readonly')
  }

  currencyFormat(value) {
    return this.currencyPipe.transform(value, this.currency || 'USD');
  }

  acceptOnlyNumbers(event, value) {
    const pattern = /^[0-9]*$/;
    if (!pattern.test(value)) {
      event.preventDefault();
    }
  }
}