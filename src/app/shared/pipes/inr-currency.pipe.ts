import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrCurrency'
})
export class InrCurrencyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: any, currencyCode: string = 'INR', symbol: string = '₹', digits: string = '1.0-0'): string | null {
    let formattedCurrency = this.currencyPipe.transform(value, currencyCode, 'symbol-narrow', digits);
    if (formattedCurrency) {
      let [currencySymbol, amount] = formattedCurrency.split(' ');
      let formattedAmount = this.formatIndianNumbering(amount);
      return `${currencySymbol} ${formattedAmount}`;
    }
    return null;
  }

  private formatIndianNumbering(value: string): string {
    let integer = value.replace(/[^0-9]/g, '');
    let lastThree = integer.substring(integer.length - 3);
    let otherNumbers = integer.substring(0, integer.length - 3);
    otherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return otherNumbers + ',' + lastThree;
  }

}
